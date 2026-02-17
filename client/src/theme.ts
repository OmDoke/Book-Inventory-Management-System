import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define custom premium colors
const primaryColor = '#1e3a8a'; // Deep Rich Blue
const secondaryColor = '#14b8a6'; // Vibrant Teal
const backgroundColor = '#f8fafc'; // Cool Light Gray
const paperColor = '#ffffff';

// Create a theme instance
let theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: primaryColor,
            light: '#60a5fa',
            dark: '#1e3a8a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: secondaryColor,
            light: '#5eead4',
            dark: '#0f766e',
            contrastText: '#ffffff',
        },
        background: {
            default: backgroundColor,
            paper: paperColor,
        },
        text: {
            primary: '#1e293b', // Slate 800
            secondary: '#64748b', // Slate 500
        },
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
        },
        button: {
            fontWeight: 600,
            textTransform: 'none', // Remove uppercase default
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 12, // More rounded modern look
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '8px 20px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${primaryColor} 0%, #3b82f6 100%)`,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#1e293b',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '&.Mui-focused fieldset': {
                            borderWidth: '2px',
                        },
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
        },
    },
});

theme = responsiveFontSizes(theme);

export default theme;
