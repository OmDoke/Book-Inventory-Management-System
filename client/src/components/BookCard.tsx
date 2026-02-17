import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, Chip, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/default.jpg';
import { Book } from '../types';

const getDisplayUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/(.+?)(\/|$)/);
            if (idMatch && idMatch[1]) {
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w400`; // Increased resolution
            }
        }
    } catch (e) {
        console.error("Error parsing URL", e);
    }
    return url;
};

interface BookCardProps {
    book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
    return (
        <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'visible',
            borderRadius: 3,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                '& .book-overlay': {
                    opacity: 1,
                }
            }
        }}>
            <CardActionArea component={Link} to={`/books/${book._id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 260, overflow: 'hidden', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                    <CardMedia
                        component="img"
                        height="100%"
                        image={getDisplayUrl(book.posterUrl) || defaultImage}
                        alt={book.title}
                        sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== defaultImage) {
                                target.src = defaultImage;
                            }
                        }}
                    />
                    <Box 
                        className="book-overlay"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            display: 'flex',
                            alignItems: 'flex-end',
                            p: 2
                        }}
                    >
                        <Chip 
                            label="View Details" 
                            color="primary" 
                            size="small" 
                            sx={{ color: 'white', fontWeight: 600 }} 
                        />
                    </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, width: '100%', p: 2.5 }}>
                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography gutterBottom variant="h6" component="div" sx={{ 
                            fontSize: '1.1rem', 
                            fontWeight: 700, 
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '2.6em' 
                        }}>
                            {book.title}
                        </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                        by {book.authorName}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            ${book.price != null ? book.price : 'N/A'}
                        </Typography>
                        {book.genre && (
                            <Chip 
                                label={book.genre} 
                                size="small" 
                                variant="outlined" 
                                sx={{ 
                                    borderColor: 'rgba(0,0,0,0.1)', 
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    height: 24
                                }} 
                            />
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default BookCard;
