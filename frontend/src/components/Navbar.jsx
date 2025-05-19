import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="primary" elevation={3} sx={{ mb: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            letterSpacing: 1,
            flexGrow: 1,
          }}
        >
          Book Review
        </Typography>
        <Stack direction="row" spacing={1}>
          {isLoggedIn ? (
            <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ ml: 1 }}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" variant="outlined">Login</Button>
              <Button color="inherit" component={Link} to="/signup" variant="contained" sx={{ ml: 1 }}>Signup</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
