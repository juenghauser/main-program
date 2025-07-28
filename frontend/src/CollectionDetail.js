import React from 'react';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

function CollectionDetail() {
  const { id } = useParams();
  return <Typography variant="h4">Collection Detail Page (ID: {id})</Typography>;
}

export default CollectionDetail;
