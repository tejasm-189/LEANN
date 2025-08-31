import React from 'react';
import { Box, Typography } from '@mui/material';

export const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to LEANN
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        The smallest vector index in the world. RAG Everything!
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1">
          Transform your laptop into a powerful RAG system that can index and search through 
          millions of documents while using 97% less storage than traditional solutions.
        </Typography>
      </Box>
    </Box>
  );
};
