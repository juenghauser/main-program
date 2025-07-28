
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const CollectionsList = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('user_id');
        const res = await fetch(`/api/collections?user_id=${userId}`);
        const json = await res.json();
        setCollections(Array.isArray(json.collections) ? json.collections : []);
      } catch (err) {
        setError('Failed to load collections');
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <Paper sx={{ maxWidth: 700, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3, maxHeight: '80vh', overflowY: 'auto', m: 'auto', mt: 8 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading collections...</Typography>
        </Stack>
      </Paper>
    );
  }

  // Filter collections
  const filteredCollections = collections.filter(col =>
    col.name.toLowerCase().includes(filter.toLowerCase()) ||
    (col.description || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box sx={{ position: 'relative', width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
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
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', pt: 8 }}>
        <Paper sx={{ maxWidth: 900, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>My Collections</Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, justifyContent: 'space-between' }}>
            <TextField
              label="Filter collections"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 220 }}
            />
            <Button variant="contained" onClick={() => navigate('/collections/add')} sx={{ ml: 'auto', minWidth: 160 }}>
              Add Collection
            </Button>
          </Stack>
          <TableContainer sx={{ bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 2, boxShadow: 1, minWidth: 500, mb: 2, maxHeight: 400, overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date Added</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCollections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary' }}>
                      No collections found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollections.map(col => (
                    <TableRow key={col.id} hover sx={{ height: 32 }}>
                      <TableCell sx={{ py: 0.5 }}>
                        <span
                          style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                          onClick={() => navigate(`/collections/${col.id}`)}
                        >
                          <FolderIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {col.name}
                        </span>
                      </TableCell>
                      <TableCell sx={{ py: 0.5 }}>{col.description || ''}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>{col.date_added ? new Date(col.date_added).toLocaleDateString() : ''}</TableCell>
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

export default CollectionsList;
