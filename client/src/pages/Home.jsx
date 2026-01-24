import { useState, useEffect } from 'react';
import { getBooks } from '../services/api';
import BookCard from '../components/BookCard';
import { Grid, Typography, Pagination, Box, CircularProgress, Alert } from '@mui/material';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchBooks = async (currPage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getBooks(currPage);
            const { data, totalPages } = response.data;
            setBooks(data);
            setTotalPages(totalPages);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch books. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page);
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Book Library
            </Typography>

            {books.length === 0 ? (
                <Typography>No books found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                            <BookCard book={book} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default Home;
