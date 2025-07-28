import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Stack, CircularProgress, Paper,
  TextField, Button, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddMedia = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState({ title: '', creator: '', type: '', status: '', publish_date: '', cover_url: '' });
  const [metadata, setMetadata] = useState([]);
  const [collections, setCollections] = useState([]);
  const [availableCollections, setAvailableCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metaName, setMetaName] = useState('');
  const [metaValue, setMetaValue] = useState('');

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      setError(null);
      try {
        const userId = localStorage.getItem('user_id');
        const allCollRes = await fetch(`/api/collections?user_id=${userId}`);
        const allCollJson = await allCollRes.json();
        setAvailableCollections(Array.isArray(allCollJson.collections) ? allCollJson.collections : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  const handleFieldChange = (field, value) => {
    setMedia(prev => ({ ...prev, [field]: value }));
  };

  const handleCollectionsChange = (event) => {
    setCollections(event.target.value);
  };

  const handleMetaAdd = () => {
    if (!metaName.trim() || !metaValue.trim()) return;
    if (metadata.some(md => md.name === metaName.trim())) return; // Prevent duplicate names
    setMetadata([...metadata, { name: metaName.trim(), value: metaValue.trim() }]);
    setMetaName('');
    setMetaValue('');
  };
  const handleMetaDelete = (name) => {
    setMetadata(metadata.filter(md => md.name !== name));
  };

  const handleSave = async () => {
    // Clear any previous errors
    setError(null);
    
    // Client-side validation
    const missingFields = [];
    if (!media.title.trim()) missingFields.push('Title');
    if (!media.creator.trim()) missingFields.push('Creator');
    if (!media.type.trim()) missingFields.push('Type');
    if (!media.status.trim()) missingFields.push('Status');

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      console.log('Validation failed - missing fields:', missingFields);
      return;
    }

    console.log('Validation passed - proceeding with save');
    try {
      const userId = localStorage.getItem('user_id');
      // POST media fields and metadata
      console.log('Payload:', {
        ...media,
        user_id: userId,
        metadata
      });
      const mediaRes = await fetch(`/api/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...media,
          user_id: userId,
          metadata
        })
      });
      
      if (!mediaRes.ok) {
        const errorText = await mediaRes.text();
        console.error('Response error:', mediaRes.status, errorText);
        throw new Error(`Failed to add media: ${mediaRes.status}`);
      }
      
      const mediaJson = await mediaRes.json();
      console.log('Response:', mediaRes.status, mediaJson);
      
      if (!mediaJson.id) throw new Error('Failed to add media - no ID returned');
      // Link collections via collection-service
      if (collections.length > 0) {
        const collRes = await fetch(`/api/collection-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            media_id: mediaJson.id,
            collection_ids: collections
          })
        });
        if (!collRes.ok) throw new Error('Failed to link collections');
      }
      // Ensure navigation to the correct URL
      console.log('About to navigate to:', `/media/${mediaJson.id}`);
      navigate(`/media/${mediaJson.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

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
          {/* Title (own line) */}
          <TextField
            label="Title"
            value={media.title}
            onChange={e => handleFieldChange('title', e.target.value)}
            sx={{ width: '100%', mb: 2, borderColor: error?.includes('Title') ? 'red' : 'inherit' }}
            required
          />
          {/* Creator (own line) */}
          <TextField
            label="Creator"
            value={media.creator}
            onChange={e => handleFieldChange('creator', e.target.value)}
            sx={{ width: '100%', mb: 2, borderColor: error?.includes('Creator') ? 'red' : 'inherit' }}
            required
          />
          {/* Status, Type, Publish Date (same line) */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={media.status}
                label="Status"
                onChange={e => handleFieldChange('status', e.target.value)}
                required
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                value={media.type}
                label="Type"
                onChange={e => handleFieldChange('type', e.target.value)}
                required
              >
                <MenuItem value="book">Book</MenuItem>
                <MenuItem value="movie">Movie</MenuItem>
                <MenuItem value="tv">TV Show</MenuItem>
                <MenuItem value="game">Game</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Publish Date"
              type="date"
              value={media.publish_date}
              onChange={e => handleFieldChange('publish_date', e.target.value)}
              sx={{ flex: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          {/* Cover URL (own line) */}
          <TextField
            label="Cover URL"
            value={media.cover_url}
            onChange={e => handleFieldChange('cover_url', e.target.value)}
            sx={{ width: '100%', mb: 2 }}
            type="url"
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Collections</Typography>
          <FormControl sx={{ width: '100%', mb: 2 }}>
            <InputLabel id="collections-label">Select Collections</InputLabel>
            <Select
              labelId="collections-label"
              multiple
              value={collections}
              onChange={handleCollectionsChange}
              input={<OutlinedInput label="Select Collections" />}
              renderValue={selected =>
                availableCollections
                  .filter(c => selected.includes(c.id))
                  .map(c => c.name)
                  .join(', ')
              }
            >
              {availableCollections.map(c => (
                <MenuItem key={c.id} value={c.id}>
                  <Checkbox checked={collections.includes(c.id)} />
                  <ListItemText primary={c.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Metadata</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Name"
              value={metaName}
              onChange={e => setMetaName(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Value"
              value={metaValue}
              onChange={e => setMetaValue(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={handleMetaAdd}>Add</Button>
          </Stack>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {metadata.map(md => (
              <Box key={md.name} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ flex: 1 }}>{md.name}: {md.value}</Typography>
                <Button color="error" size="small" onClick={() => handleMetaDelete(md.name)}>Delete</Button>
              </Box>
            ))}
          </Stack>
          {error && (
            <Typography color="error" sx={{ mb: 2 }} align="center">
              {error}
            </Typography>
          )}
          <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>Save Media</Button>
            <Button variant="outlined" color="error" onClick={() => navigate(-1)}>Discard</Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddMedia;
