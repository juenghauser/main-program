import React from 'react';
import { Typography, Box, Button, Stack, Card, CardActionArea, CardContent } from '@mui/material';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import AddBoxIcon from '@mui/icons-material/AddBox';
import NavigationBar from '../components/NavigationBar';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const username = localStorage.getItem('username');
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
            <Typography variant="h4" fontWeight={700} gutterBottom align="center">
              Welcome back{username ? `, ${username}` : ''}!
            </Typography>
            <Typography variant="h6" sx={{ mb: 3 }} align="center">
              What would you like to do today?
            </Typography>
          </Box>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 700, maxWidth: 1000 }}>
            <Box sx={{ mt: 2, maxWidth: 700, mb: 4, textAlign: 'left' }}>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                Welcome to your dashboard! Here are a few things you can do:
              </Typography>
              <ul style={{ marginLeft: 24 }}>
                <li><strong>Add new media</strong> using the <em>Add Media</em> button or the navigation bar above.</li>
                <li><strong>Browse your media</strong> by clicking <em>My Media</em> to see everything you've added.</li>
                <li>Items can be tagged and sorted for easy organization.</li>
                <li>You can edit entries later if you want to update or correct anything.</li>
                <li>Changes are saved automatically after submission.</li>
              </ul>
            </Box>

            <Stack direction="row" spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
              {/* ...code for dashboard tiles... */}
              <Card sx={{ minWidth: 300 }}>
                <CardActionArea href="/media/add">
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={600}>Add Media</Typography>
                    <Typography variant="body2" color="text.secondary">Add a new book, movie, or show</Typography>
                  </Box>
                </CardActionArea>
              </Card>              <Card sx={{ minWidth: 300 }}>
                <CardActionArea href="/media/">
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={600}>My Media</Typography>
                    <Typography variant="body2" color="text.secondary">View all saved media</Typography>
                  </Box>
                </CardActionArea>
              </Card>

              {/*<Card sx={{ minWidth: 200 }}>
                <CardActionArea href="/collections/">
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" fontWeight={600}>My Collection</Typography>
                    <Typography variant="body2" color="text.secondary">See your collections</Typography>
                  </Box>
                </CardActionArea>
              </Card>*/}
            </Stack>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
