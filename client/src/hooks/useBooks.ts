import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../services/api';
import { Book } from '../types';

interface BooksResponse {
    data: Book[];
    totalPages: number;
    currentPage: number;
}

export const useBooks = (page: number, limit: number = 12) => {
    return useQuery({
        queryKey: ['books', page, limit],
        queryFn: async () => {
            const response = await getBooks(page, limit);
            return response.data as BooksResponse;
        },
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
};
