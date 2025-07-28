import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography, Box, Divider, Chip, Avatar, Stack, CircularProgress, Paper,
  TextField, Button, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';

const EditMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [metadata, setMetadata] = useState([]);
  const [collections, setCollections] = useState([]);
  const [availableCollections, setAvailableCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metaName, setMetaName] = useState('');
  const [metaValue, setMetaValue] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        // Fetch media details
        const mediaRes = await fetch(`/api/media/${id}`);
        if (!mediaRes.ok) throw new Error('Media not found');
        const mediaData = await mediaRes.json();
        setMedia(mediaData.media);

        // Fetch metadata
        const metaRes = await fetch(`/api/media/${id}/metadata`);
        const metaJson = await metaRes.json();
        setMetadata(metaJson.metadata || []);

        // Fetch collections containing this media
        const collRes = await fetch(`/api/collection-media/${id}`);
        const collJson = await collRes.json();
        setCollections(collJson.collections ? collJson.collections.map(c => c.id) : []);

        // Fetch all available collections
        const userId = localStorage.getItem('user_id');
        //const userId = 3; // TODO: Replace with actual logged-in user ID
        const allCollRes = await fetch(`/api/collections?user_id=${userId}`);
        const allCollJson = await allCollRes.json();
        setAvailableCollections(Array.isArray(allCollJson.collections) ? allCollJson.collections : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  // Handlers for editing media fields
  const handleFieldChange = (field, value) => {
    setMedia(prev => ({ ...prev, [field]: value }));
  };

  // Collections multiselect
  const handleCollectionsChange = (event) => {
    setCollections(event.target.value);
  };

  // Metadata handlers
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

  // Save handler (stub)
  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      // PATCH media fields and metadata
      const mediaRes = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...media,
          user_id: userId,
          metadata
        })
      });
      if (!mediaRes.ok) throw new Error('Failed to save media');

      // Update collection links via collection-service
      const collRes = await fetch(`/api/collection-media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          media_id: parseInt(id, 10),
          collection_ids: collections
        })
      });
      if (!collRes.ok) throw new Error('Failed to update collections');

      navigate(`/media/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ maxWidth: 700, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3, maxHeight: '80vh', overflowY: 'auto', m: 'auto', mt: 8 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading media details...</Typography>
        </Stack>
      </Paper>
    );
  }
  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }
  if (!media) {
    return <Typography color="error" align="center">Media not found.</Typography>;
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <TextField
              label="Title"
              value={media.title || ''}
              onChange={e => handleFieldChange('title', e.target.value)}
              variant="outlined"
              sx={{ flex: 1, mr: 2 }}
            />
            <Avatar
              variant="rounded"
              src={media.cover_url ? media.cover_url : `/${media.type}.png`}
              alt={media.title}
              sx={{ width: 120, height: 160, ml: 2 }}
            />
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2} sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                value={media.type || ''}
                onChange={e => handleFieldChange('type', e.target.value)}
                input={<OutlinedInput label="Type" />}
              >
                {[...['book', 'game', 'movie', 'tv'].sort(), 'other'].map(opt => (
                  <MenuItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Creator" value={media.creator || ''} onChange={e => handleFieldChange('creator', e.target.value)} fullWidth />
            <TextField
              label="Publish Date"
              type="date"
              value={media.publish_date ? media.publish_date.substring(0, 10) : ''}
              onChange={e => handleFieldChange('publish_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={media.status || ''}
                onChange={e => handleFieldChange('status', e.target.value)}
                input={<OutlinedInput label="Status" />}
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Image URL" value={media.cover_url || ''} onChange={e => handleFieldChange('cover_url', e.target.value)} fullWidth />
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Collections</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="collections-label">Collections</InputLabel>
            <Select
              labelId="collections-label"
              multiple
              value={collections}
              onChange={handleCollectionsChange}
              input={<OutlinedInput label="Collections" />}
              renderValue={selected =>
                availableCollections.filter(c => selected.includes(c.id)).map(c => c.name).join(', ')
              }
            >
              {availableCollections.map(col => (
                <MenuItem key={col.id} value={col.id}>
                  <Checkbox checked={collections.includes(col.id)} />
                  <ListItemText primary={col.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>Other Information</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField label="Name" value={metaName} onChange={e => setMetaName(e.target.value)} fullWidth />
            <TextField label="Value" value={metaValue} onChange={e => setMetaValue(e.target.value)} fullWidth />
            <Button variant="contained" onClick={handleMetaAdd} disabled={!metaName.trim() || !metaValue.trim() || metadata.some(md => md.name === metaName.trim())}>Add</Button>
          </Stack>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {metadata.map(md => (
              <Chip
                key={md.name}
                label={`${md.name}: ${md.value}`}
                onDelete={() => handleMetaDelete(md.name)}
                sx={{ fontSize: '1rem', px: 2 }}
              />
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleSave}>Save Media</Button>
            <Button variant="outlined" color="error" onClick={() => navigate(`/media/${id}`)}>Cancel</Button>

          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditMedia;
