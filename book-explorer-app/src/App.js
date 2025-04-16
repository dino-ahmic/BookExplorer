import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import BookList from './components/Books/BookList';
import { Container, CssBaseline } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <div className="App">
          <Navbar />
          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;