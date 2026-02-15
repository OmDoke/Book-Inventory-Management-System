import { useQuery } from '@tanstack/react-query';
import { getBook } from '../services/api';
import { Book } from '../types';

export const useBook = (id: string | undefined) => {
    return useQuery({
        queryKey: ['book', id],
        queryFn: async () => {
            if (!id) throw new Error('Book ID is required');
            const response = await getBook(id);
            return response.data as Book;
        },
        enabled: !!id,
    });
};
