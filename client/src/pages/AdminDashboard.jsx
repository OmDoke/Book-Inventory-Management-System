import { useState, useEffect } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/api';
import BookTable from '../components/BookTable';
import {
    Box, Typography, Button, Container, Pagination,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Alert, CircularProgress, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const initialFormState = {
    title: '',
    authorName: '',
    publishedDate: '',
    publisher: '',
    posterUrl: '',
    overview: '',
    genre: '',
    price: 0,
    stockCount: 0
};

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Dialog State
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState(initialFormState);

    // Feedback State
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const fetchBooks = async (currPage) => {
        setLoading(true);
        try {
            // Fetch more items for admin table if possible, or stick to 16
            const response = await getBooks(currPage, 20);
            const { data, totalPages } = response.data;
            setBooks(data);
            setTotalPages(totalPages);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch books.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page);
    }, [page]);

    const handleOpen = (book = null) => {
        if (book) {
            setIsEdit(true);
            setCurrentId(book._id);
            // Format date for input if exists
            const formBook = { ...book };
            if (formBook.publishedDate) {
                formBook.publishedDate = new Date(formBook.publishedDate).toISOString().split('T')[0];
            }
            setFormData(formBook);
        } else {
            setIsEdit(false);
            setFormData(initialFormState);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'price' || name === 'stockCount') ? Number(value) : value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await updateBook(currentId, formData);
                setSuccess('Book updated successfully');
            } else {
                await createBook(formData);
                setSuccess('Book created successfully');
            }
            handleClose();
            fetchBooks(page);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Operation failed';
            setError(msg);
        }
    };

    const handleDelete = async (id) => {
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
                    <TextField margin="dense" name="title" label="Title" fullWidth value={formData.title} onChange={handleChange} required />
                    <TextField margin="dense" name="authorName" label="Author Name" fullWidth value={formData.authorName} onChange={handleChange} required />
                    <TextField margin="dense" name="publishedDate" label="Published Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.publishedDate} onChange={handleChange} />
                    <TextField margin="dense" name="publisher" label="Publisher" fullWidth value={formData.publisher} onChange={handleChange} />
                    <TextField margin="dense" name="genre" label="Genre" fullWidth value={formData.genre} onChange={handleChange} />
                    <TextField margin="dense" name="posterUrl" label="Poster URL" fullWidth value={formData.posterUrl} onChange={handleChange} />
                    <TextField margin="dense" name="overview" label="Overview" fullWidth multiline rows={4} value={formData.overview} onChange={handleChange} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField margin="dense" name="price" label="Price" type="number" fullWidth value={formData.price} onChange={handleChange} />
                        <TextField margin="dense" name="stockCount" label="Stock Count" type="number" fullWidth value={formData.stockCount} onChange={handleChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">{isEdit ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
