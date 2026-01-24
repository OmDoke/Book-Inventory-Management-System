import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook } from '../services/api';
import { Box, Typography, Button, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const response = await getBook(id);
                setBook(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch book details.');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;
    if (!book) return <Box sx={{ mt: 4 }}><Alert severity="info">Book not found</Alert></Box>;

    return (
        <Paper sx={{ p: 3, mt: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                Back to List
            </Button>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <img
                        src={book.posterUrl || 'https://via.placeholder.com/300'}
                        alt={book.title}
                        style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', backgroundColor: '#f0f0f0' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Typography variant="h3" gutterBottom>{book.title}</Typography>
                    <Typography variant="h5" color="text.secondary" gutterBottom>by {book.authorName}</Typography>

                    <Box sx={{ my: 2 }}>
                        <Typography variant="body1"><strong>Publisher:</strong> {book.publisher}</Typography>
                        <Typography variant="body1"><strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1"><strong>Genre:</strong> {book.genre}</Typography>
                        <Typography variant="body1"><strong>Price:</strong> ${book.price}</Typography>
                        <Typography variant="body1"><strong>Stock:</strong> {book.stockCount}</Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Overview</Typography>
                    <Typography variant="body1" paragraph>
                        {book.overview}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BookDetails;
