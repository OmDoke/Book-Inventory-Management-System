const API_URL = 'http://localhost:3000/api/search';

async function verifyAISearch() {
    try {
        console.log('Verifying AI Search Endpoint...');

        const query = 'Can you give me some fiction books?';
        console.log(`\nTest: Searching via AI with query: "${query}"...`);

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });

        if (!res.ok) {
            console.error(`❌ Request Failed with status: ${res.status}`);
            const text = await res.text();
            console.error(text);
            return;
        }

        const data = await res.json();

        console.log(`\nResponse Data:`);
        console.log(JSON.stringify(data, null, 2));

        if (data.status === 'success' && Array.isArray(data.results)) {
            console.log(`✅ AI successfully extracted intent and called tools! Found ${data.results.length} results.`);
        } else {
            console.error('❌ Unexpected response format.');
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    }
}

verifyAISearch();
