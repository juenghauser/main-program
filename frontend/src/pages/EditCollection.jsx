import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';

const EditCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/collections/${id}`);
        const data = await res.json();
        if (data.success && data.collection) {
          setName(data.collection.name || '');
          setDescription(data.collection.description || '');
        } else {
          setError('Collection not found');
        }
      } catch (err) {
        setError('Failed to load collection');
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/collection/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const result = await res.json();
      if (result.success) {
        navigate(`/collections/${id}`);
      } else {
        setError(result.error || 'Failed to update collection');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ maxWidth: 500, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3, m: 'auto', mt: 8 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading collection...</Typography>
        </Stack>
      </Paper>
    );
  }

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
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>Edit Collection</Typography>
          <Divider sx={{ mb: 2 }} />
          <form onSubmit={handleSave}>
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
              <Stack direction="row" spacing={2} align="center" justifyContent="center">
                <Button type="submit" variant="contained" disabled={saving}>Save</Button>
                <Button variant="outlined" color="error" onClick={() => navigate(`/collections/${id}`)}>Cancel</Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditCollection;
