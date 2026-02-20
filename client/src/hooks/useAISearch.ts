import { useMutation } from '@tanstack/react-query';
import { searchBooksByAI } from '../services/api';
import { Book } from '../types';

export interface AISearchResponse {
    status: string;
    intent: string;
    type: string;
    count: number;
    results: Book[];
}

export const useAISearch = () => {
    return useMutation({
        mutationFn: async (query: string) => {
            const response = await searchBooksByAI(query);
            return response.data as AISearchResponse;
        },
    });
};
