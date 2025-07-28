import React from 'react';
import { Typography, Box, Button, Stack, Card, CardActionArea, CardContent } from '@mui/material';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';


const Settings = () => {
  const username = localStorage.getItem('username') || 'User';
  const navigate = useNavigate();
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

        {/* Main dashboard content centered below nav/title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 700, width: '100%', py: 4 }}>
          <Box sx={{ mb: 4, pt: 12 }}>
            <Typography variant="h6" sx={{ mb: 3 }} align="center">
              Manage your account settings here!
            </Typography>
          </Box>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 700, maxWidth: 1000 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              {username}, with SortedShelf's intuitive design, you don't need to adjust the settings.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
