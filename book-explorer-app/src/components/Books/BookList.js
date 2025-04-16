import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import api from '../../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books/');
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Available Books
      </Typography>
      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {book.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Genre: {book.genre}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {book.short_description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/books/${book.id}`}
                  size="small"
                  color="primary"
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList;