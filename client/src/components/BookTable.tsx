import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Book } from '../types';

interface BookTableProps {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (id: string) => void;
}

const BookTable = ({ books, onEdit, onDelete }: BookTableProps) => {
    return (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="book table">
                <TableHead sx={{ bgcolor: 'background.default' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Author</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Genre</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Stock</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {books.map((book) => (
                        <TableRow
                            key={book._id}
                            sx={{ 
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' },
                                transition: 'background-color 0.2s'
                            }}
                        >
                            <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                {book.title}
                            </TableCell>
                            <TableCell>{book.authorName}</TableCell>
                            <TableCell>
                                {book.genre ? <Chip label={book.genre} size="small" variant="outlined" sx={{ borderRadius: 1 }} /> : '-'}
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={book.stockCount} 
                                    size="small" 
                                    color={book.stockCount < 5 ? 'error' : 'success'} 
                                    variant="filled" 
                                    sx={{ fontWeight: 600 }}
                                />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>${book.price}</TableCell>
                            <TableCell align="right">
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <IconButton 
                                        color="primary" 
                                        size="small" 
                                        onClick={() => onEdit(book)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton 
                                        color="error" 
                                        size="small" 
                                        onClick={() => onDelete(book._id!)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                    {books.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                <Typography color="text.secondary">No books available</Typography>
                            </TableCell>
                         </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BookTable;
