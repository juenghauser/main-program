import React from 'react';
import { Typography, Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';

const ResetPassword = () => (
  <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Background image layer */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/Bookshelf.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e4e4e4ff',
        zIndex: 0,
      }} />
    <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
        {/* Main dashboard content centered below nav/title */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 700, width: '100%', py: 4 }}>
          <Box sx={{ mb: 4, pt: 12 }}>
            <Typography variant="h6" sx={{ mb: 3 }} align="center">
              
            </Typography>
          </Box>
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.7)', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 700, maxWidth: 1000 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              Can’t remember your password? No problem. Please contact your system administrator for help.
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }} align="left">
              When you reach out, include:
            </Typography>
            <Box component="ul" sx={{ margin: 0, paddingLeft: 4, textAlign: 'left', listStyle: 'disc' }}>
              <li>
                <Typography variant="body2">Your username or email address</Typography>
              </li>
              <li>
                <Typography variant="body2">Any error messages you received (if applicable)</Typography>
              </li>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }} align="left">
              They’ll verify your information and guide you through resetting your password.
            </Typography>
            <Box sx={{ height: 24 }} />
            <MuiLink component={Link} to="/login" underline="hover" sx={{ fontSize: 16, fontWeight: 600 }}>
              Return to Login
            </MuiLink>
          </Box>

        </Box>
      </Box>
    </Box>
  );



export default ResetPassword;
