const API_URL = 'http://localhost:3000/api/books';

async function verifySearch() {
    try {
        console.log('Verifying Search Functionality...');

        // Test 1: Search for existing book
        const searchTerm = 'Gatsby';
        console.log(`\nTest 1: Searching for "${searchTerm}"...`);
        const res1 = await fetch(`${API_URL}?search=${searchTerm}`);
        const data1 = await res1.json();

        if (res1.status === 200 && data1.data.length > 0) {
            const book = data1.data[0];
            if (book.title.includes(searchTerm) || book.author.includes(searchTerm)) {
                console.log('✅ Test 1 Passed: Found matching book:', book.title);
            } else {
                console.error('❌ Test 1 Failed: Returned book does not match search term.');
            }
        } else {
            console.error('❌ Test 1 Failed: No books found or API error.');
        }

        // Test 2: Search for non-existent book
        const invalidTerm = 'NonExistentBook12345';
        console.log(`\nTest 2: Searching for "${invalidTerm}"...`);
        const res2 = await fetch(`${API_URL}?search=${invalidTerm}`);
        const data2 = await res2.json();

        if (res2.status === 200 && data2.data.length === 0) {
            console.log('✅ Test 2 Passed: No books returned as expected.');
        } else {
            console.error('❌ Test 2 Failed: Books returned for invalid search term.');
        }

        // Test 3: Verify Pagination works with search
        console.log(`\nTest 3: Checking pagination metadata for "${searchTerm}"...`);
        if (res1.status === 200) {
            if (data1.currentPage === 1 && typeof data1.totalPages === 'number') {
                console.log('✅ Test 3 Passed: Pagination metadata present.');
            } else {
                console.error('❌ Test 3 Failed: Invalid pagination metadata.');
            }
        }

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    }
}

verifySearch();
