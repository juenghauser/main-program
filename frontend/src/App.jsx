import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, Container, Box } from '@mui/material';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import MediaList from './pages/MediaList';
import MediaDetail from './pages/MediaDetail';
import EditMedia from './pages/EditMedia';
import AddMedia from './pages/AddMedia';
import CollectionsList from './pages/CollectionsList';
import AddCollection from './pages/AddCollection';
import EditCollection from './pages/EditCollection';
import CollectionDetail from './pages/CollectionDetail';
import UsersList from './pages/UsersList';
import UserDetail from './pages/UserDetail';
import Settings from './pages/Settings';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';

function AppContent() {
  const location = useLocation();
  // Hide nav on login, signup, reset-password
  const hideNav = ["/", "/login", "/signup", "/reset-password"].includes(location.pathname);
  const isLogin = location.pathname === "/" || location.pathname === "/login";
  return (
    <>
      <CssBaseline />
      {!hideNav && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          m: 0,
          p: 0,
          zIndex: 1000
        }}>
          <NavigationBar />
        </Box>
      )}
      {isLogin ? (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", margin: 0, padding: 0, width: '100vw', height: '100vh' }}>
          <Container maxWidth="sm" sx={{ m: 0, p: 0, width: '100vw', height: '100vh' }}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Container>
        </div>
      ) : (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          m: 0,
          p: 0,
          overflow: 'hidden',
          zIndex: 1
        }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/media" element={<MediaList />} />
            <Route path="/media/" element={<MediaList />} />
            <Route path="/media/add" element={<AddMedia />} />
            <Route path="/media/:id" element={<MediaDetail />} />
            <Route path="/media/:id/edit" element={<EditMedia />} />
            <Route path="/collections" element={<CollectionsList />} />
            <Route path="/collections/add" element={<AddCollection />} />
            <Route path="/collections/:id/edit" element={<EditCollection />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Box>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
