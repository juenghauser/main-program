import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  return <Typography variant="h4">User Detail Page (ID: {id})</Typography>;
}

export default UserDetail;
