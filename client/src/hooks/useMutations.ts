import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBook, updateBook, deleteBook, loginAdmin } from '../services/api';
import { Book } from '../types';

export const useCreateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<Book, '_id'>) => createBook(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) => updateBook(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['book', variables.id] });
        },
    });
};

export const useDeleteBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteBook(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

export const useLoginAdmin = () => {
    return useMutation({
        mutationFn: (credentials: any) => loginAdmin(credentials),
    });
};
