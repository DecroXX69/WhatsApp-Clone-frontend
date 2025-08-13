import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { WhatsApp, LockOutlined } from '@mui/icons-material';
import styled from 'styled-components';

const WelcomeContainer = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0B141A;
  padding: 40px;
  text-align: center;
`;

const WhatsAppLogo = styled(Avatar)`
  width: 320px !important;
  height: 320px !important;
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%) !important;
  margin-bottom: 32px !important;
  border: 8px solid #2A3942 !important;
`;

const WelcomeScreen = () => {
  return (
    <WelcomeContainer>
      <WhatsAppLogo>
        <WhatsApp sx={{ fontSize: 120, color: 'white' }} />
      </WhatsAppLogo>
      
      <Typography 
        variant="h4" 
        sx={{ 
          color: '#E9EDEF', 
          mb: 2, 
          fontWeight: 300,
          fontSize: '2rem'
        }}
      >
        WhatsApp Web
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#8696A0', 
          mb: 4,
          maxWidth: 400,
          lineHeight: 1.5,
          fontSize: '0.9375rem'
        }}
      >
        Send and receive messages without keeping your phone online.
        Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#8696A0' }}>
        <LockOutlined sx={{ fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontSize: '0.8125rem' }}>
          End-to-end encrypted
        </Typography>
      </Box>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
