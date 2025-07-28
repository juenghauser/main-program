import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Stack,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching collection details:', `/api/collections/${id}`);
        const res = await fetch(`/api/collections/${id}`);
        if (!res.ok) throw new Error('Collection not found');
        const json = await res.json();
        console.log('Collection response:', json);
        setCollection(json.collection);

        console.log('Fetching media for collection:', `/api/collection/${id}/media`);
        const mediaRes = await fetch(`/api/collection/${id}/media`);
        if (!mediaRes.ok) throw new Error('Failed to fetch media');
        const mediaJson = await mediaRes.json();
        console.log('Media response:', mediaJson);
        setMedia(Array.isArray(mediaJson.media) ? mediaJson.media : []);
      } catch (err) {
        console.error('Error in fetchDetails:', err);
        setError('Failed to load collection details');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <Paper sx={{ maxWidth: 700, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3, maxHeight: '80vh', overflowY: 'auto', m: 'auto', mt: 8 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading collection details...</Typography>
        </Stack>
      </Paper>
    );
  }
  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }
  if (!collection) {
    return <Typography color="error" align="center">Collection not found.</Typography>;
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
        <Paper sx={{ maxWidth: 700, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3, maxHeight: '80vh', overflowY: 'auto' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/collections')}>
                <ArrowBackIcon />
              </IconButton>
              <FolderIcon />
              <Typography variant="h5" fontWeight={600} sx={{ ml: 1 }}>{collection.name}</Typography>
            </Box>
            <Button variant="outlined" color="primary" onClick={() => navigate(`/collections/${id}/edit`)}>
              Edit
            </Button>
          </Stack>
          <Typography variant="body1" sx={{ mb: 2 }}>{collection.description}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Media in this Collection</Typography>
          <TableContainer sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2, boxShadow: 1, minWidth: 500, mb: 2, maxHeight: 400, overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {media.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary' }}>
                      No media in this collection.
                    </TableCell>
                  </TableRow>
                ) : (
                  media.map(m => (
                    <TableRow key={m.id} hover sx={{ height: 32 }}>
                      <TableCell sx={{ py: 0.5 }}>
                        <span
                          style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                          onClick={() => navigate(`/media/${m.id}`)}
                        >
                          {m.title}
                        </span>
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>{m.type}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>{m.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default CollectionDetail;