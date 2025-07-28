import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
} from '@mui/material';

const AddCollection = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const userId = localStorage.getItem('user_id');
    if (!name || !userId) {
      setError('Collection name and user are required.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId, 10), name, description }),
      });
      const result = await res.json();
      if (result.success) {
        navigate('/collections');
      } else {
        setError(result.error || 'Failed to add collection');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/bookshelfblur.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e4e4e4ff',
        zIndex: 0,
      }} />
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
        <Paper sx={{ maxWidth: 500, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Add New Collection</Typography>
          <Divider sx={{ mb: 2 }} />
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Collection Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              {error && <Typography color="error">{error}</Typography>}
              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" disabled={loading}>Add Collection</Button>
                <Button variant="outlined" onClick={() => navigate('/collections')}>Cancel</Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddCollection;
