import dbConnect from '../_lib/db';
import Book from '../_lib/models/book';
import { verifyToken } from '../_lib/auth';
import { validateBookInput } from '../_lib/validate';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 16;
            const skip = (page - 1) * limit;

            const totalBooks = await Book.countDocuments({});
            const books = await Book.find({})
                .sort({ createdAt: -1 })
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
        // Admin Only
        const user = verifyToken(req);
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Validation
        const validationErrors = validateBookInput(req.body);
        if (validationErrors) {
            return res.status(400).json({ message: 'Validation Error', errors: validationErrors });
        }

        try {
            const book = await Book.create(req.body);
            return res.status(201).json(book);
        } catch (error) {
            console.error(error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}
