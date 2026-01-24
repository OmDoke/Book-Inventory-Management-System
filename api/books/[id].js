import dbConnect from '../_lib/db';
import Book from '../_lib/models/book';
import { verifyToken } from '../_lib/auth';
import { validateBookInput } from '../_lib/validate';

export default async function handler(req, res) {
    const { id } = req.query;

    // Validate ID format (simple hex check for Mongo ObjectID)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ message: "Invalid Book ID format" });
    }

    await dbConnect();

    if (req.method === 'GET') {
        try {
            const book = await Book.findById(id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            return res.status(200).json(book);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        // Admin Only
        const user = verifyToken(req);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Parse body - if validation logic needs partial updates, we might need adjustments
        // But requirement says "Put -> Update book", we can validate the incoming fields.
        // Mongoose handles partial updates well with findByIdAndUpdate, but our custom validateBookInput
        // checks for "required" fields presence which might break PATCH behavior, 
        // but PUT usually implies REPLACING resource or main parts.
        // However, for better UX logic, I will re-use validateBookInput but we must be careful 
        // if client sends partial data. 
        // Typically PUT sends the WHOLE object.

        // If strict PUT, we expect all fields. If we treat it as PATCH-like, we check only present fields.
        // Spec says "Update book". I'll assume standard Body validation.

        const validationErrors = validateBookInput(req.body);
        if (validationErrors) {
            return res.status(400).json({ message: 'Validation Error', errors: validationErrors });
        }

        try {
            const book = await Book.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            return res.status(200).json(book);
        } catch (error) {
            console.error(error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'DELETE') {
        // Admin Only
        const user = verifyToken(req);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const book = await Book.findByIdAndDelete(id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            return res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
