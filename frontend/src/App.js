import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Dashboard from './Dashboard';
import MediaList from './MediaList';
import MediaDetail from './MediaDetail';
import CollectionsList from './CollectionsList';
import CollectionDetail from './CollectionDetail';
import UsersList from './UsersList';
import UserDetail from './UserDetail';
import Settings from './Settings';
import ResetPassword from './ResetPassword';
import Login from './pages/Login';
import SignUp from './SignUp';

function AppLayout({ children }) {
  const location = useLocation();
  // Only show navigation if not on login, signup, or reset-password
  const hideNav = ["/", "/signup", "/reset-password"].includes(location.pathname);
  return (
    <>
      <CssBaseline />
      {!hideNav && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              SortedShelf
            </Typography>
            <Button color="inherit" component={Link} to="/home">Home</Button>
            <Button color="inherit" component={Link} to="/media">Media</Button>
            <Button color="inherit" component={Link} to="/collections">Collections</Button>
            <Button color="inherit" component={Link} to="/users">Users</Button>
            <Button color="inherit" component={Link} to="/settings">Settings</Button>
            <Button color="inherit" component={Link} to="/reset-password">Reset Password</Button>
          </Toolbar>
        </AppBar>
      )}
      <Container sx={{ mt: hideNav ? 0 : 4 }}>
        {children}
      </Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/media" element={<MediaList />} />
          <Route path="/media/:id" element={<MediaDetail />} />
          <Route path="/collections" element={<CollectionsList />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
