import React, { useEffect, useState } from 'react';
import { Typography, Box, Divider, Chip, Avatar, Stack, CircularProgress, Paper, Button } from '@mui/material';
import NavigationBar from '../components/NavigationBar';
import { useParams } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';

const MediaDetail = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [metadata, setMetadata] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setCollections(collJson.collections || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

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


      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
        <Paper sx={{ maxWidth: 700, width: '100%', py: 4, px: 3, bgcolor: 'rgba(255,255,255,0.92)', borderRadius: 2, boxShadow: 3, maxHeight: '80vh', overflowY: 'auto' }}>
          {loading ? (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading media details...</Typography>
            </Stack>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : media ? (
            <>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>{media.title}</Typography>
                <Button variant="outlined" color="primary" onClick={() => window.location.href = `/media/${id}/edit`}>
                  Edit
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1"><span style={{fontWeight:700}}>Type:</span> {media.type}</Typography>
                  <Typography variant="subtitle1"><span style={{fontWeight:700}}>Creator:</span> {media.creator}</Typography>
                  <Typography variant="subtitle1"><span style={{fontWeight:700}}>Publish Date:</span> {media.publish_date || '—'}</Typography>
                  <Typography variant="subtitle1"><span style={{fontWeight:700}}>Status:</span> {media.status}</Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1, color: 'text.secondary' }}><span style={{fontWeight:700}}>Added:</span> {media.date_added ? new Date(media.date_added).toLocaleDateString() : '—'}</Typography>
                </Box>
                <Avatar
                  variant="rounded"
                  src={media.cover_url ? media.cover_url : `/${media.type}.png`}
                  alt={media.title}
                  sx={{ width: 160, height: 160, ml: 2 }}
                />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Metadata</Typography>
              {metadata.length > 0 ? (
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {metadata.map((md) => (
                    <Chip key={md.name} label={`${md.name}: ${md.value}`} sx={{ fontSize: '1rem', px: 2 }} />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">No metadata available.</Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Collections</Typography>
              {collections.length > 0 ? (
                <Stack spacing={1}>
                  {collections.map((col) => (
                    <Chip
                      key={col.id}
                      label={`${col.name} ${media?.title ? `` : ''}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">Not part of any collections.</Typography>
              )}
            </>
          ) : (
            <Typography color="error" align="center">Media not found.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default MediaDetail;
