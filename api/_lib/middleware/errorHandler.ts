import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    if (err.name === 'ValidationError') { // Mongoose Validation Error
        const errors = Object.values(err.errors).map((el: any) => ({
            field: el.path,
            message: el.message
        }));
        return res.status(400).json({ message: 'Validation Error', errors });
    }

    if (err.name === 'CastError') { // Mongoose Cast Error (Invalid ID)
        return res.status(400).json({ message: 'Invalid Resource ID' });
    }

    // Default to 500
    res.status(500).json({ message: 'Internal Server Error' });
};
