import { BookRepository } from '../repositories/BookRepository.js';

export class BookService {
    private bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository();
    }

    async getBooks(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [books, totalBooks] = await Promise.all([
            this.bookRepository.findAll(skip, limit),
            this.bookRepository.countDocuments()
        ]);

        return {
            data: books,
            currentPage: page,
            totalPages: Math.ceil(totalBooks / limit),
            totalBooks,
        };
    }

    async getBookById(id: string) {
        return this.bookRepository.findById(id);
    }

    async createBook(data: any) {
        return this.bookRepository.create(data);
    }

    async updateBook(id: string, data: any) {
        return this.bookRepository.update(id, data);
    }

    async deleteBook(id: string) {
        return this.bookRepository.delete(id);
    }
}
