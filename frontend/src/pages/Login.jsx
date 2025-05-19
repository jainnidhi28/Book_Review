import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Paper, Stack } from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', form);
      localStorage.setItem('token', res.data.token);
      setIsLoggedIn && setIsLoggedIn(true);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 6 }, width: '100%', maxWidth: 420, borderRadius: 4 }}>
        <Typography variant="h3" fontWeight={700} color="primary.dark" mb={3} align="center">Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField label="Email" name="email" type="email" fullWidth required onChange={handleChange} size="large" />
            <TextField label="Password" name="password" type="password" fullWidth required onChange={handleChange} size="large" />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.5, fontSize: 18 }}>Login</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
