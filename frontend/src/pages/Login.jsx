import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Alert, Link as MuiLink, Divider, Stack } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.user_id && username) {
          localStorage.setItem('username', username);
          if (!localStorage.getItem('user_id')) {
            localStorage.setItem('user_id', data.user_id);
          }
        }
        navigate('/home'); // Redirect to Home page after login
      } else {
        const data = await response.json();
        setError(data.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to auth service');
    }
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url(/Bookshelf.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.92)', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 400, maxWidth: 500 }}>
          <Typography variant="h3" align="center" fontWeight={700} gutterBottom>SortedShelf</Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
            Your personal library for books, films, and more.
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 2, fontSize: 15, color: 'text.secondary' }}>
            Keep track of the media you've watched or plan to watch<br />
            with all the customization you could ask for!
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                required
              />
              <MuiLink component={Link} to="/reset-password" underline="hover" sx={{ fontSize: 14, textAlign: 'right' }}>
                Forgot Password?
              </MuiLink>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 600 }}>
                Login
              </Button>
            </Stack>
          </form>
          {/* <Divider sx={{ my: 3 }}>or</Divider> 
          <Button component={Link} to="/signup" variant="outlined" color="primary" fullWidth sx={{ fontWeight: 600 }}>
            Create New Account
          </Button> */}
        </Box>
        <Box sx={{ mt: 4, maxWidth: 500 }}>
          <Typography variant="h5" align="center" sx={{ color: '#fff', fontWeight: 600, fontSize: '1.5rem', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
            "The best stories are the ones still to come" — Shubhangi Swarup
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
