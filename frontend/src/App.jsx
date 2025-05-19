import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import { CssBaseline, Box } from '@mui/material';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#fff',
          color: '#222',
          width: '100vw',
          overflowX: 'hidden',
        }}
      >
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 1, sm: 3 }, pt: 2 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/books" />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/add-book" element={isLoggedIn ? <AddBook /> : <Navigate to="/login" />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
