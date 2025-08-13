import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Done, DoneAll, Schedule } from '@mui/icons-material';
import styled from 'styled-components';
import moment from 'moment';

const MessageContainer = styled(Box)`
  display: flex;
  margin: 2px 0;
  ${props => props.$isSent ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
`;

const MessageBubble = styled(Paper)`
  max-width: 65%;
  min-width: 80px;
  padding: 6px 12px 8px 12px;
  position: relative;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13) !important;
  
  ${props => props.$isSent 
    ? `
      background-color: #005C4B !important;
      color: #FFFFFF !important;
      border-radius: 7.5px 7.5px 0 7.5px;
      margin-left: 50px;
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: -8px;
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-bottom-color: #005C4B;
        border-right: 0;
        border-bottom-right-radius: 1px;
        transform: rotate(-10deg);
      }
    `
    : `
      background-color: #202C33 !important;
      color: #E9EDEF !important;
      border-radius: 7.5px 7.5px 7.5px 0;
      margin-right: 50px;
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: -8px;
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-bottom-color: #202C33;
        border-left: 0;
        border-bottom-left-radius: 1px;
        transform: rotate(10deg);
      }
    `
  }

  @media (max-width: 768px) {
    max-width: 80%;
    ${props => props.$isSent ? 'margin-left: 20px;' : 'margin-right: 20px;'}
  }
`;

const StatusIcon = styled(Box)`
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  
  .status-icon {
    font-size: 14px;
    ${props => {
      switch (props.$status) {
        case 'sent':
          return 'color: #8696A0;';
        case 'delivered':
          return 'color: #8696A0;';
        case 'read':
          return 'color: #53BDEB;';
        default:
          return 'color: #8696A0;';
      }
    }}
  }
`;

const MessageTime = styled(Typography)`
  font-size: 11px !important;
  color: ${props => props.$isSent ? '#8696A0' : '#8696A0'} !important;
  margin-top: 2px !important;
  line-height: 1 !important;
  user-select: none;
`;

const MessageBubbleComponent = ({ message }) => {
  const isSent = message.from === 'business_account';
  
  const getStatusIcon = () => {
    if (!isSent) return null;
    
    switch (message.status) {
      case 'sent':
        return <Done className="status-icon" />;
      case 'delivered':
        return <DoneAll className="status-icon" />;
      case 'read':
        return <DoneAll className="status-icon" />;
      default:
        return <Schedule className="status-icon" />;
    }
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).format('HH:mm');
  };

  return (
    <MessageContainer $isSent={isSent} className="message-bubble">
      <MessageBubble 
        elevation={0} 
        $isSent={isSent}
        sx={{
          backgroundColor: isSent ? '#005C4B !important' : '#202C33 !important',
          color: isSent ? '#FFFFFF !important' : '#E9EDEF !important'
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-word',
            fontSize: '0.9375rem',
            lineHeight: 1.3,
            color: isSent ? '#FFFFFF !important' : '#E9EDEF !important',
            mb: 0.5
          }}
        >
          {message.text?.body || message.document?.caption || message.image?.caption || 'Media message'}
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 0.5,
            mt: 1
          }}
        >
          <MessageTime $isSent={isSent}>
            {formatTime(message.timestamp)}
          </MessageTime>
          <StatusIcon $status={message.status}>
            {getStatusIcon()}
          </StatusIcon>
        </Box>
      </MessageBubble>
    </MessageContainer>
  );
};

export default MessageBubbleComponent;
