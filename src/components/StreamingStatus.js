import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const statusMessages = {
  thinking: 'Thinking...',
  applying: 'Applying edits...',
  done: 'Done',
  error: 'Error occurred',
};

const StreamingStatus = ({ status }) => {
  if (!status || status === 'done') return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body1" color="text.primary">
          {statusMessages[status]}
        </Typography>
      </Box>
    </Box>
  );
};

export default StreamingStatus; 