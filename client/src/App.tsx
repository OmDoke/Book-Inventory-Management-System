import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getBooks } from './services/api';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';

import { Book } from './types';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

function App() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const fetchBooks = async (currPage: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getBooks(currPage, 12);
            // Validation: Ensure response is JSON and contains expected data structure
            if (!response.data || typeof response.data !== 'object') {
                throw new Error('Invalid server response format');
            }
            const { data, totalPages } = response.data;
            if (!Array.isArray(data)) {
                 throw new Error('Received invalid data from server');
            }
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

    return (
        <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                                Book Inventory
                            </Link>
                        </Typography>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/admin/dashboard">Admin</Button>
                    </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home
                                    books={books}
                                    loading={loading}
                                    error={error}
                                    page={page}
                                    setPage={setPage}
                                    totalPages={totalPages}
                                />
                            }
                        />
                        <Route path="/books/:id" element={<BookDetails />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Container>
                <Footer />
            </Box>
        </Router>
    );
}

export default App;
