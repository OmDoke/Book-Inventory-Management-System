export interface Book {
    _id: string;
    title: string;
    authorName: string;
    price: number;
    stockCount: number;
    publisher?: string;
    publishedDate?: string; // Date comes as string from JSON
    posterUrl?: string;
    overview?: string;
    genre?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    _id: string;
    username: string;
    role: string;
}
