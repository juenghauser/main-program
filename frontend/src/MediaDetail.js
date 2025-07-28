import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

function MediaDetail() {
  const { id } = useParams();
  return <Typography variant="h4">Media Detail Page (ID: {id})</Typography>;
}

export default MediaDetail;
