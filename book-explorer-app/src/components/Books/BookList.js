import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
  });
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        sort: sortBy,
        order: sortOrder,
      };
      const response = await api.get('/books/', { params });
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters, sortBy, sortOrder]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
       Find your next book
      </Typography>

      {/* Filter and Sort Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filter by Title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filter by Author"
              name="author"
              value={filters.author}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Filter by Genre"
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="publication_date">Publication Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
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

      {/* Book List */}
      <Box sx={{ width: '100%' }}>
        {books.map((book) => (
          <Card 
            key={book.id} 
            sx={{ 
              mb: 2,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              height: '200px', // Fixed height
            }}
          >
            <CardContent sx={{ flex: 1, pb: 0 }}>
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
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default BookList;