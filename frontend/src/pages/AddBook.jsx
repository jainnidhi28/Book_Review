import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, Paper, Stack } from '@mui/material';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const [form, setForm] = useState({ title: '', author: '', genre: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/books', form);
      setSuccess('Book added!');
      setForm({ title: '', author: '', genre: '', description: '' });
      setTimeout(() => navigate('/books'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} display="flex" flexDirection="column" alignItems="center">
        <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
          <Typography variant="h4" fontWeight={700} color="primary.dark" mb={2} align="center">Add a New Book</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
              <TextField label="Author" name="author" value={form.author} onChange={handleChange} fullWidth required />
              <TextField label="Genre" name="genre" value={form.genre} onChange={handleChange} fullWidth />
              <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline minRows={2} />
              <Button type="submit" variant="contained" color="primary" size="large">Add Book</Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
