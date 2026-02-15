import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body1" align="center" gutterBottom>
                    Book Inventory Management System
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <IconButton aria-label="github" color="inherit" component={Link} href="https://github.com/OmDoke" target="_blank" rel="noopener noreferrer">
                        <GitHubIcon />
                    </IconButton>
                    <IconButton aria-label="linkedin" color="inherit" component={Link} href="https://www.linkedin.com/in/onkar-doke" target="_blank" rel="noopener noreferrer">
                        <LinkedInIcon />
                    </IconButton>
                    <IconButton aria-label="email" color="inherit" component={Link} href="mailto:onkardoke9696@gmail.com">
                        <EmailIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" align="center">
                    {'Copyright © '}
                    <Link color="inherit" href="/">
                        Om Doke
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
