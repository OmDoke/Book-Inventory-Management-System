import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import { Box, TextField, Button, Typography, Paper, Alert, Grid, useTheme } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await loginAdmin(credentials);
            const { token } = response.data;
            localStorage.setItem('adminToken', token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
            console.error(err);
        }
    };

    return (
        <Grid container component="main" sx={{ height: 'calc(100vh - 64px)' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderTopRightRadius: 24,
                    borderBottomRightRadius: 24,
                    overflow: 'hidden',
                    display: { xs: 'none', sm: 'block' }
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Box} elevation={6} square sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: 400,
                        width: '100%'
                    }}
                >
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 5, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            borderRadius: 4,
                            border: '1px solid rgba(0,0,0,0.05)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Box sx={{ 
                            mb: 2, 
                            p: 1.5, 
                            bgcolor: 'primary.main', 
                            borderRadius: '50%', 
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 16px rgba(30, 58, 138, 0.2)'
                        }}>
                             <LockOpenIcon fontSize="large" />
                        </Box>
                        
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                            Admin Access
                        </Typography>
                        
                        {error && <Alert severity="error" sx={{ mb: 3, width: '100%', borderRadius: 2 }}>{error}</Alert>}
                        
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={credentials.username}
                                onChange={handleChange}
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={credentials.password}
                                onChange={handleChange}
                                InputProps={{ sx: { borderRadius: 2 } }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                            >
                                Sign In
                            </Button>
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Authorised Personnel Only
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
};

export default AdminLogin;
