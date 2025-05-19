import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardActions, TextField, Pagination, Stack, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ author: '', genre: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      let url = `/books?page=${pageNum}&limit=9`;
      if (filters.author) url += `&author=${filters.author}`;
      if (filters.genre) url += `&genre=${filters.genre}`;
      setPage(pageNum);
      const res = await api.get(url);
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []); // initial load

  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    fetchBooks();
  };

  const handleReset = () => {
    setFilters({ author: '', genre: '' });
    fetchBooks();
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={3} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Typography variant="h3" fontWeight={700} color="primary.dark">Books</Typography>
        <Button component={Link} to="/add-book" variant="contained" color="primary" sx={{ mt: { xs: 2, sm: 0 } }}>Add Book</Button>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center" justifyContent="center">
        <TextField label="Author" name="author" value={filters.author} onChange={handleFilter} size="small" />
        <TextField label="Genre" name="genre" value={filters.genre} onChange={handleFilter} size="small" />
        <Button variant="contained" color="primary" onClick={handleSearch} sx={{ height: 40, fontWeight: 600, minWidth: 100 }}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleReset}>Reset</Button>
      </Stack>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <Fade in={!loading}>
        <Box sx={{ overflowX: 'auto', width: '100%' }}>
          {books.length === 0 && !loading ? (
            <Typography align="center" sx={{ my: 4 }}>No books found.</Typography>
          ) : (
            <Box sx={{ minWidth: 650 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: 12, fontWeight: 700, textAlign: 'left' }}>Title</th>
                    <th style={{ padding: 12, fontWeight: 700, textAlign: 'left' }}>Author</th>
                    <th style={{ padding: 12, fontWeight: 700, textAlign: 'left' }}>Genre</th>
                    <th style={{ padding: 12, fontWeight: 700, textAlign: 'left' }}>Description</th>
                    <th style={{ padding: 12, fontWeight: 700, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book._id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>{book.title}</td>
                      <td style={{ padding: 12 }}>{book.author}</td>
                      <td style={{ padding: 12 }}>{book.genre || 'N/A'}</td>
                      <td style={{ padding: 12 }}>{book.description}</td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <Button component={Link} to={`/books/${book._id}`} variant="outlined" size="small">Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
      </Fade>
      <Box mt={5} display="flex" justifyContent="center">
        <Pagination count={totalPages} page={page} onChange={(_, val) => fetchBooks(val)} color="primary" />
      </Box>
    </Container>
  );
}
