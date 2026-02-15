import { z } from 'zod';

export const BookSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    authorName: z.string().min(1, 'Author name is required'),
    isbn: z.string().optional(),
    publisher: z.string().min(1, 'Publisher is required'),
    publishedDate: z.string().min(1, 'Published date is required'), // Input type="date" returns string
    genre: z.string().min(1, 'Genre is required'),
    price: z.number({ invalid_type_error: 'Price is required' }).min(0, 'Price must be positive'),
    stockCount: z.number({ invalid_type_error: 'Stock is required' }).int().min(0, 'Stock must be non-negative'),
    overview: z.string().min(10, 'Overview must be at least 10 characters'),
    posterUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const LoginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export type BookFormData = z.infer<typeof BookSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
