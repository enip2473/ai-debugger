export type Diagnose = {
    "severity": 'success' | 'info' | 'warning' | 'error',
    "message": string,
}

import React from 'react';
import { Stack, Typography, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const MessageWithIcon = ({severity, message}: Diagnose) => {
  
  return (
    <Alert 
      severity={severity}
      sx={{ display: 'flex', alignItems: 'center', p: 2 }}
      iconMapping={{
        warning: <WarningAmberIcon fontSize="small" />,
        error: <ErrorOutlineIcon fontSize="small" />
      }}
      className='my-2'
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2">
          {message}
        </Typography>
      </Stack>
    </Alert>
  );
};

export default MessageWithIcon;
