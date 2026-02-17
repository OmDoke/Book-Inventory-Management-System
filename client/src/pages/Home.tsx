import BookCard from '../components/BookCard';
import { Book } from '../types';
import { Grid, Typography, Pagination, Box, CircularProgress, Alert, Container, Divider } from '@mui/material';

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

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, height: '50vh', alignItems: 'center' }}><CircularProgress size={60} /></Box>;
    if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box className="fade-in">
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #1e3a8a, #14b8a6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>
                    Discover Your Next Read
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                    Explore our curated collection of books ranging from timeless classics to modern masterpieces.
                </Typography>
                <Divider sx={{ maxWidth: 100, mx: 'auto', borderWidth: 2, borderColor: 'primary.main', borderRadius: 1 }} />
            </Box>

            {books?.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5" color="text.secondary">No books found in the library.</Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                            <BookCard book={book} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    shape="rounded"
                    showFirstButton 
                    showLastButton
                />
            </Box>
        </Box>
    );
};

export default Home;
