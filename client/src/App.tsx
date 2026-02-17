import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
    const [search, setSearch] = useState<string>('');
    const { data: responseData, isLoading: loading, error, isError } = useBooks(page, 12, search);

    const books = responseData?.data || [];
    const totalPages = responseData?.totalPages || 1;

    // Error handling is now managed by React Query's error state
    const errorMessage = isError ? (error as Error).message : null;

    return (
        <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MenuBookIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h6" component="div" sx={{ color: 'text.primary', fontWeight: 700 }}>
                                Book Inventory
                            </Typography>
                        </Link>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button component={Link} to="/" variant="text" color="primary">
                                Home
                            </Button>
                            <Button 
                                component={Link} 
                                to="/admin/dashboard" 
                                variant="contained" 
                                color="primary"
                                size="small"
                                sx={{ borderRadius: '20px', px: 3 }}
                            >
                                Admin Area
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Container component="main" maxWidth="lg" sx={{ mt: 5, mb: 8, flexGrow: 1 }}>
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
                                    search={search}
                                    setSearch={setSearch}
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
