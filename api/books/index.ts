import dbConnect from '../_lib/db.js';
import Book from '../_lib/models/book.js';
import { verifyToken } from '../_lib/auth.js';
import { validate } from '../_lib/middleware/validate.js';
import { BookSchema } from '../_lib/schemas.js';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;
            const skip = (page - 1) * limit;

            const totalBooks = await Book.countDocuments({});
            const books = await Book.find({})
                .sort({ createdAt: -1, _id: 1 })
                .skip(skip)
                .limit(limit);

            return res.status(200).json({
                data: books,
                currentPage: page,
                totalPages: Math.ceil(totalBooks / limit),
                totalBooks,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        const validator = validate(BookSchema);
        // We need to await the validator as a promise wrapper or use it inline if it was express middleware
        // Since this is a Vercel/Next.js style handler (req, res), and 'validate' is written as Express middleware (req, res, next)
        // We need to adapt it. 
        // My validate middleware returns (req, res, next) => void.

        // Let's adapt it inline for simplicity in this handler style, or wrap it.
        // Express middleware style: validate(schema)(req, res, next)

        return new Promise((resolve) => {
            validator(req, res, async (err) => {
                if (err) return resolve(undefined); // Error handled by middleware or next(err)

                // Validated. Proceed to Admin Check & Logic
                // Admin Only
                const user = verifyToken(req);
                if (!user || user.role !== 'admin') {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                try {
                    const book = await Book.create(req.body);
                    res.status(201).json(book);
                    resolve(undefined);
                } catch (error) {
                    console.error(error);
                    if (error.name === 'ValidationError') {
                        res.status(400).json({ message: error.message });
                    } else {
                        res.status(500).json({ message: 'Internal Server Error' });
                    }
                    resolve(undefined);
                }
            });
        });

    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
