import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Rating,
  Snackbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getReadingList, removeFromReadingList } from '../../services/api';

const ReadingList = () => {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchReadingList = async () => {
    try {
      setLoading(true);
      const response = await getReadingList();
      setReadingList(response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reading list. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingList();
  }, []);

  const handleRemoveFromList = async (bookId) => {
    try {
      await removeFromReadingList(bookId);
      setReadingList(readingList.filter(item => item.book.id !== bookId));
      setSnackbar({
        open: true,
        message: "Book successfully removed from your reading list!",
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to remove book from reading list. Please try again.",
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        My Reading List
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      ) : (
        <Box sx={{ width: '100%' }}>
          {readingList.length === 0 ? (
            <Alert severity="info">
              Your reading list is empty. Browse books to add some!
            </Alert>
          ) : (
            readingList.map((item) => (
              <Card 
                key={item.id} 
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
                        value={Number(item.book.average_rating) || 0}
                        readOnly
                        max={1}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({item.book.average_rating ? Number(item.book.average_rating).toFixed(1) : '0.0'}/10)
                      </Typography>
                    </div>
                    <Typography variant="caption" color="text.secondary">
                      {item.book.total_ratings || 0} ratings
                    </Typography>
                  </Box>

                  <Box sx={{ pr: 12 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.book.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      by {item.book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Genre: {item.book.genre}
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
                      {item.book.short_description}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ 
                  justifyContent: 'center',
                  pb: 2 
                }}>
                  <Button
                    component={Link}
                    to={`/books/${item.book.id}`}
                    size="small"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleRemoveFromList(item.book.id)}
                    color="error"
                  >
                    Remove from List
                  </Button>
                </CardActions>
              </Card>
            ))
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

export default ReadingList;