import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper
} from '@mui/material';
import api from '../../services/api';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      password2: '',
      first_name: '',
      last_name: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await api.post('/auth/register/', formData);
        navigate('/login');
      } catch (err) {
        if (err.response?.data) {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, messages]) => {
              const message = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${message}`;
            })
            .join('\n');
          setError(errorMessages);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    };

  return (
    <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              value={formData.password2}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none' }}
                >
                  Sign In
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm;