import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  return (
    <Typography variant="h5">User Detail for ID: {id} (placeholder)</Typography>
  );
};

export default UserDetail;
