import dbConnect from '../_lib/db.js';
import Book from '../_lib/models/book.js';
import { verifyToken } from '../_lib/auth.js';
import { validate } from '../_lib/middleware/validate.js';
import { BookSchema } from '../_lib/schemas.js';

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
        const validator = validate(BookSchema.partial());

        return new Promise((resolve) => {
            validator(req, res, async (err) => {
                if (err) return resolve(undefined);

                // Validated.
                // Admin Only
                const user = verifyToken(req);
                if (!user || user.role !== 'admin') {
                    res.status(401).json({ message: 'Unauthorized' });
                    return resolve(undefined);
                }

                try {
                    const book = await Book.findByIdAndUpdate(id, req.body, {
                        new: true,
                        runValidators: true,
                    });
                    if (!book) {
                        res.status(404).json({ message: 'Book not found' });
                    } else {
                        res.status(200).json(book);
                    }
                } catch (error) {
                    console.error(error);
                    if (error.name === 'ValidationError') {
                        res.status(400).json({ message: error.message });
                    } else {
                        res.status(500).json({ message: 'Internal Server Error' });
                    }
                }
                resolve(undefined);
            });
        });

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

