import BookCard from '../components/BookCard';
import { Book } from '../types';
import { Grid, Typography, Pagination, Box, CircularProgress, Alert } from '@mui/material';

interface HomeProps {
    books: Book[];
    loading: boolean;
    error: string | null;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

const Home = ({ books, loading, error, page, setPage, totalPages }: HomeProps) => {

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Book Library
            </Typography>

            {books?.length === 0 ? (
                <Typography>No books found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={book._id}>
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
