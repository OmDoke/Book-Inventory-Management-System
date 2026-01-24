import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea component={Link} to={`/books/${book._id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CardMedia
                    component="img"
                    height="140"
                    // Use placeholder if posterUrl is invalid or missing, checking simple startWith or null
                    image={book.posterUrl || 'https://via.placeholder.com/150'}
                    alt={book.title}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Fallback
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                        {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {book.authorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ${book.price != null ? book.price : 'N/A'}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default BookCard;
