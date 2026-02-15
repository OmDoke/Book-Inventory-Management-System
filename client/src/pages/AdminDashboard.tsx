import { useState, useEffect } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/api';
import BookTable from '../components/BookTable';
import BookForm from '../components/BookForm';
import { BookFormData } from '../schemas';
import {
    Box, Typography, Button, Container, Pagination,
    Dialog, DialogTitle, DialogContent,
    Alert, CircularProgress, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Dialog State
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [currentBook, setCurrentBook] = useState<Partial<BookFormData> | undefined>(undefined);

    // Feedback State
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchBooks = async (currPage: number) => {
        setLoading(true);
        try {
            const response = await getBooks(currPage, 20);
            const { data, totalPages } = response.data;
            setBooks(data);
            setTotalPages(totalPages);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch books.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page);
    }, [page]);

    const handleOpen = (book: any = null) => {
        setError(null);
        if (book) {
            setIsEdit(true);
            setCurrentId(book._id);
            
            // Map API data to Form Data
            setCurrentBook({
                title: book.title,
                authorName: book.authorName,
                isbn: book.isbn || '',
                publisher: book.publisher,
                publishedDate: book.publishedDate ? new Date(book.publishedDate).toISOString().split('T')[0] : '',
                genre: book.genre,
                price: book.price,
                stockCount: book.stockCount,
                overview: book.overview,
                posterUrl: book.posterUrl || ''
            });
        } else {
            setIsEdit(false);
            setCurrentId(null);
            setCurrentBook(undefined);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
        setCurrentBook(undefined); // Reset form data
    };

    const handleFormSubmit = async (data: BookFormData) => {
        try {
            if (isEdit && currentId) {
                await updateBook(currentId, data);
                setSuccess('Book updated successfully');
            } else {
                await createBook(data);
                setSuccess('Book created successfully');
            }
            handleClose();
            fetchBooks(page);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Operation failed';
            setError(msg);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(id);
                setSuccess('Book deleted successfully');
                fetchBooks(page);
            } catch (err) {
                console.error(err);
                setError('Failed to delete book');
            }
        }
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Admin Dashboard</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                    Add New Book
                </Button>
            </Box>

            {success && <Snackbar open autoHideDuration={6000} onClose={() => setSuccess(null)} message={success} />}

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <BookTable books={books} onEdit={handleOpen} onDelete={handleDelete} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" />
                    </Box>
                </>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    {/* Render Form only when open to reset state properly or pass key */}
                    {open && (
                        <BookForm 
                            defaultValues={currentBook} 
                            onSubmit={handleFormSubmit}
                            submitLabel={isEdit ? 'Update' : 'Create'}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
