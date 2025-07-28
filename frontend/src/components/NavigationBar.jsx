
import React, { useState } from 'react';
import { Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';

const navItems = [
  { text: 'Home', icon: <HomeIcon />, to: '/home' },
  { text: 'Add Media', icon: <AddBoxIcon />, to: '/media/add' },
  { text: 'My Media', icon: <CollectionsBookmarkIcon />, to: '/media/' },
  { text: 'Settings', icon: <SettingsIcon />, to: '/settings' },
  { text: 'Log Out', icon: <LogoutIcon />, to: '/login' },
];

const NavigationBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Show page title based on route
  let pageTitle = '';
  if (location.pathname === '/home') pageTitle = 'Home';
  else if (location.pathname === '/media' || location.pathname === '/media/') pageTitle = 'My Media';
  else if (/^\/media\/(\d+)\/edit$/.test(location.pathname)) pageTitle = 'Edit Media';
  else if (/^\/media\/add$/.test(location.pathname)) pageTitle = 'Add Media';
  else if (/^\/media\/(\d+)$/.test(location.pathname)) pageTitle = 'Media Details';
  else if (location.pathname === '/collections' || location.pathname === '/collections/') pageTitle = 'My Collection';
  else if (/^\/collections\/(\d+)$/.test(location.pathname)) pageTitle = 'Collection Details';
  else if (/^\/collections\/add$/.test(location.pathname)) pageTitle = 'Add Collection';
  else if (/^\/collections\/(\d+)$/.test(location.pathname)) pageTitle = 'Collection Details';
  else if (location.pathname === '/settings') pageTitle = 'Settings';
  else pageTitle = '';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, position: 'relative', backgroundColor: '#3B3734' }}>
      <IconButton
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          mr: 2,
          ml: 2,
          backgroundColor: '#e4e4e4ff',
          borderRadius: '50%',
          width: 48,
          height: 48,
          boxShadow: 2,
          '&:hover': { backgroundColor: '#e4e4e4ff' },
        }}
      >
        <MenuIcon sx={{ color: '#3B3734', fontSize: 32 }} />
      </IconButton>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <Typography sx={{ fontWeight: 700, fontFamily: 'serif', fontSize: '2.75rem', color: '#e4e4e4ff' }}>{pageTitle}</Typography>
        {/* Show Edit button only on Collection Details page */}
        {/^(\/collections\/(\d+))$/.test(location.pathname) && (
          <IconButton
            aria-label="edit collection"
            sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: '#e4e4e4ff', backgroundColor: '#1976d2', ml: 2 }}
            onClick={() => {
              const match = location.pathname.match(/^\/collections\/(\d+)$/);
              if (match) navigate(`/collections/${match[1]}/edit`);
            }}
          >
            <SettingsIcon />
          </IconButton>
        )}
      </Box>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <List>
            {navItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default NavigationBar;
