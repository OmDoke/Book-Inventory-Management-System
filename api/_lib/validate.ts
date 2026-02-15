// Helper to validate input data for creating/updating books
// Returns an array of error messages, or null if valid.

function validateBookInput(data) {
    const errors = [];

    // Required fields check
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
        errors.push("Title is required and must be a string.");
    }
    if (!data.authorName || typeof data.authorName !== 'string' || !data.authorName.trim()) {
        errors.push("Author Name is required and must be a string.");
    }

    // URL format
    if (data.posterUrl) {
        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        if (!urlRegex.test(data.posterUrl)) {
            errors.push("Poster URL must be a valid URL.");
        }
    }

    // Numbers & Integers
    if (data.price !== undefined) {
        if (typeof data.price !== 'number' || data.price < 0) {
            errors.push("Price must be a positive number.");
        }
    }

    if (data.stockCount !== undefined) {
        if (!Number.isInteger(data.stockCount) || data.stockCount < 0) {
            errors.push("Stock Count must be a non-negative integer.");
        }
    }

    return errors.length > 0 ? errors : null;
}

export { validateBookInput };
