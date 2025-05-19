import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Button, TextField, Alert, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/axios';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: '', comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const userId = getUserId();

  function getUserId() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  const fetchBook = async () => {
    const res = await api.get(`/books/${id}`);
    setBook(res.data.book);
    setReviews(res.data.reviews);
    setAverageRating(res.data.averageRating);
  };

  useEffect(() => { fetchBook(); }, [id]);

  const handleChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, reviewForm);
        setSuccess('Review updated!');
      } else {
        await api.post(`/books/${id}/reviews`, reviewForm);
        setSuccess('Review added!');
      }
      setReviewForm({ rating: '', comment: '' });
      setEditingReview(null);
      fetchBook();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/reviews/${deleteId}`);
      setSuccess('Review deleted!');
      setOpenDialog(false);
      setDeleteId(null);
      fetchBook();
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  if (!book) return <Container><Typography>Loading...</Typography></Container>;

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={3}>
        <Typography variant="h3" fontWeight={700} color="primary.dark">{book.title}</Typography>
        <Typography variant="subtitle1" mb={1}>By <b>{book.author}</b></Typography>
        <Typography variant="subtitle2" color="text.secondary">Genre: {book.genre || 'N/A'}</Typography>
        <Typography mt={2} mb={1}>{book.description}</Typography>
        <Typography mt={2} fontWeight={500}>Average Rating: {averageRating ? averageRating.toFixed(2) : 'N/A'}</Typography>
      </Box>
      <Box mt={4} mb={3}>
        <Typography variant="h6" mb={1}>{editingReview ? 'Edit Your Review' : 'Add a Review'}</Typography>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 1 }}>{success}</Alert>}
        <form onSubmit={handleReviewSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField label="Rating (1-5)" name="rating" type="number" value={reviewForm.rating} onChange={handleChange} required inputProps={{ min: 1, max: 5 }} size="small" sx={{ width: 120 }} />
            <TextField label="Comment" name="comment" value={reviewForm.comment} onChange={handleChange} size="small" sx={{ flex: 1 }} />
            <Button type="submit" variant="contained" color="primary">{editingReview ? 'Update' : 'Submit'}</Button>
            {editingReview && (
              <Button variant="text" color="secondary" onClick={() => { setEditingReview(null); setReviewForm({ rating: '', comment: '' }); }}>Cancel</Button>
            )}
          </Stack>
        </form>
      </Box>
      <Box mt={4}>
        <Typography variant="h5" mb={2}>Reviews</Typography>
        {reviews.length === 0 ? <Typography>No reviews yet.</Typography> : (
          reviews.map((r) => (
            <Card key={r._id} sx={{ mb: 2, boxShadow: 2 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={600}>{r.user?.username || 'User'} <span style={{ color: '#888', fontWeight: 400 }}>(rated {r.rating}/5)</span></Typography>
                    <Typography variant="body2" color="text.secondary">{r.comment}</Typography>
                  </Box>
                  {userId && r.user && r.user._id === userId && (
                    <Box>
                      <IconButton onClick={() => handleEdit(r)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => { setOpenDialog(true); setDeleteId(r._id); }}><DeleteIcon /></IconButton>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Review?</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this review?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
