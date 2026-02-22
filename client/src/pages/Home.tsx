import BookCard from '../components/BookCard';
import { Book } from '../types';
import { Grid, Typography, Pagination, Box, CircularProgress, Alert, Divider, TextField, InputAdornment, Button, Tooltip, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface HomeProps {
    books: Book[];
    loading: boolean;
    error: string | null;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    search: string;
    setSearch: (search: string) => void;
    aiSearchMode: boolean;
    setAiSearchMode: (mode: boolean) => void;
    aiSearchResults: Book[] | null;
    aiSearchLoading: boolean;
    handleAiSearch: (query: string) => void;
}

const Home = ({ books, loading, error, page, setPage, totalPages, search, setSearch, aiSearchMode, setAiSearchMode, aiSearchResults, aiSearchLoading, handleAiSearch }: HomeProps) => {

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const debouncedAiSearch = useDebounce(search, 1000);

    useEffect(() => {
        if (aiSearchMode && debouncedAiSearch.trim()) {
            handleAiSearch(debouncedAiSearch);
        }
    }, [debouncedAiSearch, aiSearchMode, handleAiSearch]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        if (!aiSearchMode) {
            setPage(1); // Reset to first page on normal search
        }
    };

    const triggerAiSearch = () => {
        if (search.trim()) {
            handleAiSearch(search);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && aiSearchMode) {
            triggerAiSearch();
        }
    };

    // Provide overall loading state
    const isFetching = loading || aiSearchLoading;
    if (isFetching && !books.length && !aiSearchResults) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, height: '50vh', alignItems: 'center' }}><CircularProgress size={60} /></Box>;
    if (error) return <Box sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box className="fade-in">
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #1e3a8a, #14b8a6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>
                    Discover Your Next Read
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                    Explore our curated collection of books ranging from timeless classics to modern masterpieces.
                </Typography>
                
                <Box sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={aiSearchMode ? "Ask me to find a book... 'Can you recommend some sci-fi?'" : "Search by title or author..."}
                        value={search}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: aiSearchMode && (
                                <InputAdornment position="end">
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={triggerAiSearch}
                                        disabled={!search.trim() || aiSearchLoading}
                                        sx={{ borderRadius: '20px', minWidth: '80px' }}
                                    >
                                        Ask AI
                                    </Button>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '50px', backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'background.paper' } }
                        }}
                    />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2 }}>
                    <Tooltip title="Regular Database Search">
                        <Chip 
                            label="Standard Search" 
                            clickable 
                            color={!aiSearchMode ? "primary" : "default"} 
                            variant={!aiSearchMode ? "filled" : "outlined"}
                            onClick={() => setAiSearchMode(false)} 
                        />
                    </Tooltip>
                    <Tooltip title="Natural Language Conversational Search">
                        <Chip 
                            icon={<AutoAwesomeIcon fontSize="small" />} 
                            label="AI Smart Search" 
                            clickable 
                            color={aiSearchMode ? "secondary" : "default"} 
                            variant={aiSearchMode ? "filled" : "outlined"}
                            onClick={() => setAiSearchMode(true)} 
                        />
                    </Tooltip>
                </Box>

                <Divider sx={{ maxWidth: 100, mx: 'auto', borderWidth: 2, borderColor: 'primary.main', borderRadius: 1 }} />
            </Box>

            {isFetching && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {aiSearchMode && !isFetching && aiSearchResults !== null && (
                <>
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        <AutoAwesomeIcon sx={{ color: 'secondary.main', mr: 1, verticalAlign: 'middle' }} /> 
                        AI Recommendations
                    </Typography>
                    {aiSearchResults.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 5 }}>
                            <Typography variant="h6" color="text.secondary">The AI couldn't find any books matching your request.</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            {aiSearchResults.map((book) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={book._id || book.title}>
                                    <BookCard book={book} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    <Divider sx={{ my: 4 }} />
                </>
            )}

            {!aiSearchMode && (
                <>

            {books?.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5" color="text.secondary">No books found matching your search.</Typography>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {books.map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                            <BookCard book={book} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    shape="rounded"
                    showFirstButton 
                    showLastButton
                />
            </Box>
            </>
            )}
        </Box>
    );
};

export default Home;
