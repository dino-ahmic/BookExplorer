import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  TextField,
  Button,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Rating,
  Snackbar
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getBookById, getBookNotes, createBookNote, updateBookNote, deleteBookNote, rateBook, addToReadingList } from '../../services/api';


const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
    });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchBookAndNotes = async () => {
    try {
      setLoading(true);
      const [book, notes] = await Promise.all([
        getBookById(id),
        getBookNotes(id)
      ]);
      setBook(book);
      setNotes(notes);
      setUserRating(book.user_rating || 0);
    } catch (err) {
      setError('Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookAndNotes();
  }, [id]);

  useEffect(() => {
    if (!user) {
      setUserRating(0);
    }
  }, [user]);

  const handleAddNote = async () => {
    try {
      const response = await createBookNote(id, { content: newNote });
      setNotes([response, ...notes]);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note');
    }
  };

  const handleUpdateNote = async (noteId) => {
    try {
      const updatedNote = await updateBookNote(noteId, {content: editingNote.content});
      setNotes(notes.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      setEditingNote(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteBookNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const handleRating = async (event, newValue) => {
    try {
      await rateBook(id, newValue);
      setUserRating(newValue);
      fetchBookAndNotes();
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  const handleAddToReadingList = async () => {
    try {
      await addToReadingList(id);
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

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy hh:mm a');
    } catch (error) {
      return dateString;
    }
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4 }}>
        <CardContent>
            {/* Title and Rating Section */}
            <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2
            }}>
                
            <Box>
                <Typography variant="h4" gutterBottom>
                {book.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                by {book.author}
                </Typography>
            </Box>

            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end'
            }}>
                <Rating
                name="book-rating"
                value={userRating}
                max={10}
                onChange={handleRating}
                disabled={!user}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                ({book?.average_rating ? Number(book.average_rating).toFixed(1) : '0.0'}/10)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {book?.total_ratings || 0} ratings
                </Typography>
                {!user ?
                <Typography variant="caption" color="text.secondary">
                    Please log in to rate
                </Typography>
                : <Button
                variant="contained"
                color="primary"
                onClick={handleAddToReadingList}
                sx={{ mt: 1 }}
              >
                Add to Reading List
              </Button>}
            </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Book Details */}
            <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography>
                <strong>Genre:</strong> {book.genre}
            </Typography>
            <Typography>
                <strong>Publication Date:</strong> {formatDate(book.publication_date)}
            </Typography>
            <Typography>
                <strong>ISBN:</strong> {book.isbn}
            </Typography>
            <Typography>
                <strong>Pages:</strong> {book.page_count}
            </Typography>
            <Typography>
                <strong>Description:</strong>
                <br />
                {book.about}
            </Typography>
            </Box>
        </CardContent>
        </Card>

      {/* Notes Section */}
      {notes.length > 0 ?
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Reviews
        </Typography>

        {user && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Leave a review..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              Submit
            </Button>
          </Paper>
        )}

        {/* Notes List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notes.map((note) => (
            <Paper key={note.id} sx={{ p: 2 }}>
              {editingNote?.id === note.id ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, content: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateNote(note.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditingNote(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      {note.user?.username} - {formatDate(note.created_at)}
                    </Typography>
                    {user && user.id === note.user?.id && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => setEditingNote(note)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography>{note.content}</Typography>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      </Box>
      : <Typography variant="h6" gutterBottom>
      This book does not have any review.
    </Typography>}
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

export default BookDetails;