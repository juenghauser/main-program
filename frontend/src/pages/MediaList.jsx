import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AddBoxIcon from '@mui/icons-material/AddBox';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const [collections, setCollections] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    
    // Fetch media data
    fetch(`/api/media?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        let mediaItems = [];
        if (Array.isArray(data)) {
          mediaItems = data;
        } else if (Array.isArray(data.media)) {
          mediaItems = data.media;
        } else {
          mediaItems = [];
        }
        setMedia(mediaItems);
        
        // Fetch collections for each media item
        const collectionsMap = {};
        const promises = mediaItems.map(item => 
          fetch(`/api/collection-media/${item.id}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && Array.isArray(data.collections)) {
                collectionsMap[item.id] = data.collections;
              } else {
                collectionsMap[item.id] = [];
              }
            })
            .catch(() => {
              collectionsMap[item.id] = [];
            })
        );
        
        Promise.all(promises).then(() => {
          setCollections(collectionsMap);
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setMedia(media.filter(item => item.id !== id));
  };

  // Filter and sort logic
  const filteredMedia = media.filter(item => {
    const f = filter.trim().toLowerCase();
    const itemCollections = collections[item.id] || [];
    const collectionText = itemCollections.length > 0 
      ? itemCollections.map(col => col.name).join(', ').toLowerCase()
      : 'draft';
    
    return (
      item.title?.toLowerCase().includes(f) ||
      item.creator?.toLowerCase().includes(f) ||
      item.type?.toLowerCase().includes(f) ||
      collectionText.includes(f)
    );
  });
  
  const sortedMedia = [...filteredMedia].sort((a, b) => {
    if (sortBy === 'collections') {
      // Special sorting for collections column
      const aCollections = collections[a.id] || [];
      const bCollections = collections[b.id] || [];
      const aText = aCollections.length > 0 
        ? aCollections.map(col => col.name).join(', ').toLowerCase()
        : 'draft';
      const bText = bCollections.length > 0 
        ? bCollections.map(col => col.name).join(', ').toLowerCase()
        : 'draft';
      
      if (aText < bText) return sortDir === 'asc' ? -1 : 1;
      if (aText > bText) return sortDir === 'asc' ? 1 : -1;
      return 0;
    } else {
      // Regular sorting for other columns
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      valA = typeof valA === 'string' ? valA.toLowerCase() : valA;
      valB = typeof valB === 'string' ? valB.toLowerCase() : valB;
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    }
  });

  if (loading) {
    return <Typography variant="h6">Loading media...</Typography>;
  }

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Background image layer */}
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

      {/* All content inside the blurred background */}
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
        {/* Filter and Add button on same line above table */}
        <Box sx={{ width: '100%', maxWidth: 1000, mb: 2, mt: '120pt', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ width: 350, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 1, border: '1px solid #ccc', p: 1 }}>
            <TextField
              label="Filter by Title, Creator, Type, or Collections"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              sx={{ width: '100%' }}
              size="small"
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={() => navigate('/media/add')}
            sx={{ fontWeight: 700, fontSize: '1.1rem', borderRadius: 2 }}
          >
            Add
          </Button>
        </Box>
        {/* Table with Data */}
        <Box sx={{ maxWidth: 2500, p: '20pt'}}>
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 1000,
              mt: 2,
              mb: '20pt',
              maxHeight: 600,
              overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                    setSortBy('title');
                    setSortDir(sortBy === 'title' && sortDir === 'asc' ? 'desc' : 'asc');
                  }}>
                    Title {sortBy === 'title' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                    setSortBy('creator');
                    setSortDir(sortBy === 'creator' && sortDir === 'asc' ? 'desc' : 'asc');
                  }}>
                    Author/Creator {sortBy === 'creator' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                    setSortBy('type');
                    setSortDir(sortBy === 'type' && sortDir === 'asc' ? 'desc' : 'asc');
                  }}>
                    Type {sortBy === 'type' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => {
                    setSortBy('collections');
                    setSortDir(sortBy === 'collections' && sortDir === 'asc' ? 'desc' : 'asc');
                  }}>
                    Collections {sortBy === 'collections' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedMedia.map((item) => (
                  <TableRow key={item.id} hover sx={{ height: 32 }}>
                    <TableCell sx={{ py: 0.5 }}>
                      <span
                        style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                        onClick={() => navigate(`/media/${item.id}`)}
                      >
                        {item.title}
                      </span>
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>{item.creator}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{item.type}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      {collections[item.id] && collections[item.id].length > 0 
                        ? collections[item.id].map(col => col.name).join(', ')
                        : <span style={{ fontStyle: 'italic', color: '#666' }}>Draft</span>
                      }
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}align="center">
                      <IconButton aria-label="delete" color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default MediaList;
