import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBook';
import { Box, Typography, Button, Paper, Grid, CircularProgress, Alert, Chip, Divider, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import defaultImage from '../assets/default.jpg';

const getDisplayUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/(.+?)(\/|$)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
            }
        }
    } catch (e) {
        console.error("Error parsing URL", e);
    }
    return url;
};

const BookDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const { data: book, isLoading: loading, error, isError } = useBook(id);

    const errorMessage = isError ? 'Failed to fetch book details.' : null;

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Box>;
    if (errorMessage) return <Box sx={{ mt: 4 }}><Alert severity="error">{errorMessage}</Alert></Box>;
    if (!book) return <Box sx={{ mt: 4 }}><Alert severity="info">Book not found</Alert></Box>;

    return (
        <Box className="fade-in">
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/')} 
                sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
            >
                Back to Collection
            </Button>
            
            <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 4, 
                bgcolor: 'background.paper',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
                <Grid container spacing={6}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ 
                            position: 'relative', 
                            borderRadius: 3, 
                            overflow: 'hidden', 
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                            bgcolor: '#f5f5f5' 
                        }}>
                            <img
                                src={getDisplayUrl(book.posterUrl) || defaultImage}
                                alt={book.title}
                                style={{ width: '100%', display: 'block' }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== defaultImage) {
                                        target.src = defaultImage;
                                    }
                                }}
                            />
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={7}>
                        <Box>
                            <Box sx={{ mb: 2 }}>
                                {book.genre && (
                                    <Chip 
                                        label={book.genre} 
                                        color="secondary" 
                                        size="small" 
                                        sx={{ 
                                            borderRadius: 2, 
                                            fontWeight: 600, 
                                            textTransform: 'uppercase', 
                                            mb: 2,
                                            letterSpacing: '0.05em'
                                        }} 
                                    />
                                )}
                                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                                    {book.title}
                                </Typography>
                                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    by {book.authorName}
                                </Typography>
                            </Box>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoneyIcon color="primary" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">Price</Typography>
                                        <Typography variant="h6" fontWeight="bold">${book.price}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <InventoryIcon color="primary" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">Stock</Typography>
                                        <Typography variant="h6" fontWeight="bold">{book.stockCount} units</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarTodayIcon color="primary" />
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">Published</Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {book.publishedDate ? new Date(book.publishedDate).getFullYear() : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Overview</Typography>
                            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                {book.overview}
                            </Typography>
                            
                            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', color: 'text.secondary' }}>
                                    Product Details
                                </Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Publisher</Typography>
                                        <Typography variant="body2" fontWeight="500">{book.publisher}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Full Date</Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default BookDetails;
