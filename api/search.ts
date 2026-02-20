import dbConnect from './_lib/db.js';
import Book from './_lib/models/book.js';
import { ChatGroq } from "@langchain/groq";
import {
    StateGraph,
    StateSchema,
    MessagesValue,
    START,
    END,
} from "@langchain/langgraph";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const serviceSearchBook = async (title?: string | null, authorName?: string | null, genre?: string | null, publisher?: string | null, publishedDate?: any) => {
    let queryCond: any = {};

    if (title) {
        queryCond["title"] = { $regex: title, $options: "i" };
    }

    if (authorName) {
        queryCond["authorName"] = { $regex: authorName, $options: "i" };
    }

    if (genre) {
        queryCond["genre"] = { $regex: genre, $options: "i" };
    }

    if (publisher) {
        queryCond["publisher"] = { $regex: publisher, $options: "i" };
    }

    if (publishedDate) {
        if (publishedDate.from && publishedDate.to) {
            queryCond["publishedDate"] = {
                $gte: new Date(publishedDate.from, 0, 1),
                $lte: new Date(publishedDate.to, 11, 31),
            };
        } else if (publishedDate.from) {
            queryCond["publishedDate"] = { $gte: new Date(publishedDate.from, 0, 1) };
        } else if (publishedDate.to) {
            queryCond["publishedDate"] = { $lte: new Date(publishedDate.to, 11, 31) };
        }
    }

    console.log(`serviceSearchBook - Query: ${JSON.stringify(queryCond)}`);

    const assets = await Book.find(queryCond).sort({ publishedDate: -1 }).limit(10).lean();

    if (!assets || assets.length === 0) {
        return {
            status: "success",
            type: "book",
            count: 0,
            results: []
        };
    }

    return {
        status: "success",
        type: "book",
        count: assets.length,
        results: assets.map((asset: any) => ({
            title: asset.title,
            authorName: asset.authorName,
            publishedDate: asset.publishedDate,
            publisher: asset.publisher,
            genre: asset.genre,
            price: asset.price,
            overview: asset.overview,
            posterUrl: asset.posterUrl,
        }))
    };
};

const searchBooksTool = tool(
    async ({ title, authorName, genre, publisher, publishedDate }) => {
        console.log(`Tool searchBooks called with: ${JSON.stringify({ title, authorName, genre, publisher, publishedDate })}`);
        return await serviceSearchBook(title, authorName, genre, publisher, publishedDate);
    },
    {
        name: "searchBooks",
        description: "Search for books by title, authorName, genre, publisher & publishedDate year",
        schema: z.object({
            title: z.string().optional().describe("The title of the book to search for"),
            authorName: z.string().optional().describe("The author name of the book to search for"),
            genre: z.string().optional().describe("The genre of the book to search for"),
            publisher: z.string().optional().describe("The publisher of the book to search for"),
            publishedDate: z.object(
                {
                    from: z.number().optional().describe("Start year (e.g., 2015)"),
                    to: z.number().optional().describe("End year (e.g., 2018)")
                }).optional().describe("The published date year range of the books to search for"),
        }),
    }
);

const toolsByName = {
    [searchBooksTool.name]: searchBooksTool,
};


export default async function handler(req: any, res: any) {
    // Enable CORS or accept all as appropriate, here we just do POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await dbConnect();

        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required in request body' });
        }

        const model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.1-8b-instant",
            maxRetries: 2,
        });

        const tools = Object.values(toolsByName);
        const modelWithTools = model.bindTools(tools);

        // Define state schema similar to user's implementation
        // Simplified without ReducedValue for llmCalls unless needed, but let's keep it close:
        const MessagesState = new StateSchema({
            messages: MessagesValue,
        });

        const llmCall = async (state: any) => {
            const response = await modelWithTools.invoke([
                new SystemMessage(`
                    You are a Bookstore search assistant.

                    STRICT RULES:

                    1. You MUST call only ONE tool.
                        After receiving tool results, you MUST immediately return the final JSON response.
                        Do NOT call another tool.
                        Do NOT perform multi-step reasoning.
                    2. You must return ONLY ONE JSON object.
                    3. You must return results for type: "book".
                    4. Never return multiple JSON objects.
                    5. Never return text, explanation, or markdown.
                    6. Output must be valid JSON in this exact structure.

                    Response format:
                    {
                        "status": "success" | "fail",
                        "intent": "search",
                        "type": "book",
                        "count": number,
                        "results": [
                        {
                            "title": string,
                            "authorName": string,
                            "publishedDate": string,
                            "publisher": string,
                            "genre": string,
                            "price": number,
                            "overview": string,
                            "posterUrl": string
                        }]
                    }

                    If no results found:
                    {
                        "status": "success",
                        "intent": "search",
                        "type": "book",
                        "count": 0,
                        "results": []
                    }
                `),
                ...state.messages,
            ]);
            return {
                messages: [response]
            };
        };

        const toolNode = async (state: any) => {
            const lastMessage = state.messages.at(-1);

            if (lastMessage == null || !lastMessage.tool_calls) {
                return { messages: [] };
            }

            const result = [];
            for (const toolCall of lastMessage.tool_calls ?? []) {
                const action = toolsByName[toolCall.name as keyof typeof toolsByName];
                if (action) {
                    const observation = await action.invoke(toolCall);
                    result.push(
                        new ToolMessage({
                            content: JSON.stringify(observation),
                            tool_call_id: toolCall.id,
                        })
                    );
                }
            }

            return { messages: result };
        };

        const shouldContinue = (state: any) => {
            const lastMessage = state.messages.at(-1);

            if (!lastMessage || !lastMessage.tool_calls) {
                return END;
            }

            if (lastMessage.tool_calls?.length) {
                return "toolNode";
            }

            return END;
        };

        const graph = new StateGraph(MessagesState)
            .addNode("llmCall", llmCall)
            .addNode("toolNode", toolNode)
            .addEdge(START, "llmCall")
            .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
            .addEdge("toolNode", "llmCall")
            .compile();


        const result = await graph.invoke(
            { messages: [new HumanMessage(query)] },
            { recursionLimit: 5 }
        );

        const finalMessage = result.messages.at(-1)?.content || "{}";
        const parsedMessage = JSON.parse(typeof finalMessage === 'string' ? finalMessage : "{}");

        return res.status(200).json(parsedMessage);

    } catch (error: any) {
        console.error("AI Search Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
