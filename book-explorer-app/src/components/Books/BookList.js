import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Rating,
  Snackbar
} from '@mui/material';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ClearIcon from '@mui/icons-material/Clear';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
  });
  
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchBooks = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      const response = await api.get('/books/', { 
        params: {
          ...searchParams,
          sort: sortBy,
          order: sortOrder,
        }
      });
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  const debouncedFetch = useCallback(
    debounce((searchParams) => {
      fetchBooks(searchParams);
    }, 500),
    [fetchBooks]
  );

  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToReadingList = async (bookId) => {
    try {
      await api.post(`/reading-list/add/${bookId}/`);
      setSnackbar({
        open: true,
        message: "Book successfully added to your reading list!",
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to add book to reading list. Please try again.",
        severity: 'error'
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
    });
    setSortBy('title');
    setSortOrder('asc');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Find your next book
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, marginBottom: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{ ml: 2 }}
              >
                Clear Filters
              </Button>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filter by Title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filter by Author"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filter by Genre"
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ width: '170px' }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="publication_date">Publication Date</MenuItem>
                <MenuItem value="average_rating">Rating</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: '150px' }} size="small">
              <InputLabel>Sort Order</InputLabel>
              <Select
                value={sortOrder}
                label="Sort Order"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      ) : (
        <Box sx={{ width: '100%' }}>
          {books.map((book) => (
            <Card 
              key={book.id} 
              sx={{ 
                mb: 2,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '200px',
              }}
            >
              <CardContent sx={{ flex: 1, pb: 0, position: 'relative' }}>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end'
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <Rating
                      value={Number(book.average_rating) || 0}
                      readOnly
                      max={1}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({book.average_rating ? Number(book.average_rating).toFixed(1) : '0.0'}/10)
                    </Typography>
                  </div>
                  <Typography variant="caption" color="text.secondary">
                    {book.total_ratings || 0} ratings
                  </Typography>
                </Box>

                <Box sx={{ pr: 12 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Genre: {book.genre}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {book.short_description}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ 
                justifyContent: 'center',
                pb: 2 
              }}>
                <Button
                  component={Link}
                  to={`/books/${book.id}`}
                  size="small"
                  color="primary"
                  sx={{ textTransform: 'none' }}
                >
                  View Details
                </Button>
                {user && (
                    <Button
                      size="small"
                      onClick={() => handleAddToReadingList(book.id)}
                      color="primary"
                    >
                      Add to Reading List
                    </Button>
                  )}
              </CardActions>
            </Card>
          ))}
          {books.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
              No books found matching your criteria.
            </Typography>
          )}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookList;