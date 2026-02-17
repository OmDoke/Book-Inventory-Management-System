import Book from '../models/book.js';

export class BookRepository {
    async findAll(skip: number, limit: number) {
        return Book.find({})
            .sort({ createdAt: -1, _id: 1 })
            .skip(skip)
            .limit(limit);
    }

    async countDocuments() {
        return Book.countDocuments({});
    }

    async findById(id: string) {
        return Book.findById(id);
    }

    async create(data: any) {
        return Book.create(data);
    }

    async update(id: string, data: any) {
        return Book.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id: string) {
        return Book.findByIdAndDelete(id);
    }
}
