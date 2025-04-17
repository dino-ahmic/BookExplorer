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
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current user from localStorage or your auth context
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchBookAndNotes = async () => {
    try {
      setLoading(true);
      const [bookResponse, notesResponse] = await Promise.all([
        api.get(`/books/${id}/`),
        api.get(`/books/${id}/notes/`)
      ]);
      setBook(bookResponse.data);
      setNotes(notesResponse.data);
    } catch (err) {
      setError('Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookAndNotes();
  }, [id]);

  const handleAddNote = async () => {
    try {
      const response = await api.post(`/books/${id}/notes/create/`, {
        content: newNote
      });
      setNotes([response.data, ...notes]);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note');
    }
  };

  const handleUpdateNote = async (noteId) => {
    try {
      const response = await api.put(`/notes/${noteId}/update/`, {
        content: editingNote.content
      });
      setNotes(notes.map(note => 
        note.id === noteId ? response.data : note
      ));
      setEditingNote(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}/delete/`);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
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
      {/* Book Details Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {book.author}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Typography>
              <strong>Genre:</strong> {book.genre}
            </Typography>
            <Typography>
              <strong>Publication Date:</strong> {format(new Date(book.publication_date), 'MMMM d, yyyy')}
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
              {book.short_description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Book Notes
      </Typography>

      {/* Add Note Form (only for logged-in users) */}
      {currentUser && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Add your note about this book..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddNote}
            disabled={!newNote.trim()}
          >
            Add Note
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
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({
                    ...editingNote,
                    content: e.target.value
                  })}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Posted by {note.username} on {formatDate(note.created_at)}
                  </Typography>
                  {currentUser && currentUser.id === note.user?.id && (
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
    </Container>
  );
};

export default BookDetails;