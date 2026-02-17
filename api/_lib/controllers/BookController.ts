import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/BookService.js';
import { BookSchema } from '../schemas.js';
import { z } from 'zod';

export class BookController {
    private bookService: BookService;

    constructor() {
        this.bookService = new BookService();
    }

    index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const result = await this.bookService.getBooks(page, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query; // Next.js API routes put dynamic params in query
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: "Invalid ID" });
            }

            const book = await this.bookService.getBookById(id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validation is now handled by middleware or manually here if preferred.
            // Since we advocate for Clean Architecture + Safe Parsing:
            const validatedData = BookSchema.parse(req.body);
            const book = await this.bookService.createBook(validatedData);
            res.status(201).json(book);
        } catch (error) {
            next(error);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: "Invalid ID" });
            }

            const validatedData = BookSchema.partial().parse(req.body);
            const book = await this.bookService.updateBook(id, validatedData);

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.query;
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ message: "Invalid ID" });
            }

            const book = await this.bookService.deleteBook(id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
