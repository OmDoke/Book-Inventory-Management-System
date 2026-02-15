import { z } from 'zod';

export const BookSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    authorName: z.string().min(1, 'Author name is required'),
    isbn: z.string().min(10, 'ISBN must be at least 10 characters').optional(),
    publisher: z.string().min(1, 'Publisher is required'),
    publishedDate: z.string().or(z.date()).transform((val) => new Date(val)),
    genre: z.string().min(1, 'Genre is required'),
    price: z.number().min(0, 'Price must be positive'),
    stockCount: z.number().int().min(0, 'Stock count must be a non-negative integer'),
    overview: z.string().min(10, 'Overview must be at least 10 characters'),
    posterUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const UserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    email: z.string().email('Invalid email address').optional(),
});

export type BookInput = z.infer<typeof BookSchema>;
export type UserInput = z.infer<typeof UserSchema>;
