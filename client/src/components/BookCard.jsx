import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import defaultImage from '../assets/default.jpg';

const getDisplayUrl = (url) => {
    if (!url) return null;
    try {
        // Handle Google Drive links
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/\/d\/(.+?)(\/|$)/);
            if (idMatch && idMatch[1]) {
                // Use the thumbnail link which is more reliable for embedding
                return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w300`;
            }
        }
    } catch (e) {
        console.error("Error parsing URL", e);
    }
    return url;
};

const BookCard = ({ book }) => {
    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea component={Link} to={`/books/${book._id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CardMedia
                    component="img"
                    height="140"
                    // Use placeholder if posterUrl is invalid or missing
                    image={getDisplayUrl(book.posterUrl) || defaultImage}
                    alt={book.title}
                    onError={(e) => {
                        if (e.target.src !== defaultImage) {
                            e.target.src = defaultImage;
                        }
                    }} // Fallback
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
