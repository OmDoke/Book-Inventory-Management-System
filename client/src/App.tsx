import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';



// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

function App() {
    const [page, setPage] = useState<number>(1);
    const { data: responseData, isLoading: loading, error, isError } = useBooks(page);

    const books = responseData?.data || [];
    const totalPages = responseData?.totalPages || 1;

    // Error handling is now managed by React Query's error state
    // We can extract the error message if needed
    const errorMessage = isError ? (error as Error).message : null;

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
                                    error={errorMessage}
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
