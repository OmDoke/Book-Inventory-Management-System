import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BookTable = ({ books, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="book table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Stock</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {books.map((book) => (
                        <TableRow
                            key={book._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {book.title}
                            </TableCell>
                            <TableCell>{book.authorName}</TableCell>
                            <TableCell>{book.stockCount}</TableCell>
                            <TableCell>${book.price}</TableCell>
                            <TableCell align="right">
                                <IconButton color="primary" onClick={() => onEdit(book)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(book._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BookTable;
