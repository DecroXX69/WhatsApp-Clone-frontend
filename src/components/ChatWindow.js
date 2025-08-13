import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Fab
} from '@mui/material';
import { 
  Send, 
  Person, 
  MoreVert,
  ArrowBack,
  AttachFile,
  EmojiEmotions,
  Mic,
  KeyboardArrowDown,
  Search
} from '@mui/icons-material';
import styled from 'styled-components';
import MessageBubble from './MessageBubble';

const Header = styled(Box)`
  background: #2A3942;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #313D45;
  position: relative;
  z-index: 1;
`;

const MessagesContainer = styled(Box)`
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding: 12px 80px 12px 80px;
  background: #0B141A;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(18, 140, 126, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(37, 211, 102, 0.02) 0%, transparent 50%);
  position: relative;

  @media (max-width: 768px) {
    padding: 12px 16px;
    height: calc(100vh - 120px);
  }
`;

const InputContainer = styled(Box)`
  padding: 16px 20px;
  background: #2A3942;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  border-top: 1px solid #313D45;

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 8px;
  }
`;

const MessageInputContainer = styled(Box)`
  flex: 1;
  background: #40505A;
  border-radius: 24px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  min-height: 48px;
  max-height: 120px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  
  & .MuiInputBase-root {
    border: none;
    background: transparent;
    color: #E9EDEF;
    font-size: 0.9375rem;
    line-height: 1.3;
    padding: 0;
    
    &::before, &::after {
      display: none;
    }
    
    & .MuiInputBase-input {
      padding: 0;
      
      &::placeholder {
        color: #8696A0;
        opacity: 1;
      }
    }
  }
`;

const SendButton = styled(IconButton)`
  background: #00A884 !important;
  color: #FFFFFF !important;
  width: 48px !important;
  height: 48px !important;
  
  &:hover {
    background: #00926C !important;
  }
  
  &:disabled {
    background: #374248 !important;
    color: #8696A0 !important;
  }
`;

const ScrollToBottomButton = styled(Fab)`
  position: absolute !important;
  bottom: 80px !important;
  right: 20px !important;
  background: #2A3942 !important;
  color: #8696A0 !important;
  width: 40px !important;
  height: 40px !important;
  
  &:hover {
    background: #374248 !important;
  }
`;

// Typing indicator for current user
const TypingIndicator = styled(Box)`
  position: absolute;
  bottom: 80px;
  left: 80px;
  background: #202C33;
  padding: 8px 12px;
  border-radius: 12px;
  color: #8696A0;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    left: 16px;
  }
`;

const TypingDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #00A884;
  animation: typing 1.4s infinite;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 20% { opacity: 0.4; }
    50% { opacity: 1; }
    80%, 100% { opacity: 0.4; }
  }
`;

const ChatWindow = ({ chat, messages, onSendMessage, onBack, isMobile, isTyping, onTypingChange }) => {
  const [newMessage, setNewMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Handle typing indicator
    if (e.target.value.trim() && !isTyping) {
      onTypingChange(true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onTypingChange(false);
    }, 1000); // Stop typing after 1 second of inactivity
    
    // If input is empty, stop typing immediately
    if (!e.target.value.trim()) {
      onTypingChange(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0B141A', position: 'relative' }}>
      <Header>
        {isMobile && (
          <IconButton onClick={onBack} sx={{ color: '#E9EDEF', mr: 1 }}>
            <ArrowBack />
          </IconButton>
        )}
        
        <Avatar 
          sx={{ 
            bgcolor: 'linear-gradient(135deg, #667781 0%, #8696A0 100%)', 
            width: 40, 
            height: 40,
            mr: 2,
            border: '2px solid #313D45'
          }}
        >
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#E9EDEF' }}>
            {getInitials(chat.name)}
          </Typography>
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#E9EDEF', fontSize: '1.0625rem' }}>
            {chat.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#8696A0', fontSize: '0.8125rem' }}>
            {chat.phone_number} • {isTyping ? 'typing...' : 'Last seen recently'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: '#8696A0' }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: '#8696A0' }} onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>
      </Header>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2A3942',
            color: '#E9EDEF',
            border: '1px solid #313D45'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>Contact info</MenuItem>
        <MenuItem onClick={handleMenuClose}>Select messages</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mute notifications</MenuItem>
        <MenuItem onClick={handleMenuClose}>Clear messages</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete chat</MenuItem>
      </Menu>

      <MessagesContainer ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <MessageBubble key={message.message_id || index} message={message} />
        ))}
        <div ref={messagesEndRef} />
        
        {showScrollButton && (
          <ScrollToBottomButton onClick={() => scrollToBottom()}>
            <KeyboardArrowDown />
          </ScrollToBottomButton>
        )}
        
        {/* Show typing indicator when user is typing */}
        {isTyping && (
          <TypingIndicator>
            <Typography sx={{ fontSize: '0.75rem', color: '#8696A0', mr: 1 }}>
              You are typing
            </Typography>
            <TypingDot />
            <TypingDot />
            <TypingDot />
          </TypingIndicator>
        )}
      </MessagesContainer>

      <InputContainer>
        <IconButton sx={{ color: '#8696A0' }}>
          <AttachFile />
        </IconButton>
        
        <MessageInputContainer>
          <IconButton sx={{ color: '#8696A0', p: 0.5 }}>
            <EmojiEmotions />
          </IconButton>
          
          <StyledTextField
            multiline
            maxRows={4}
            placeholder="Type a message"
            variant="standard"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </MessageInputContainer>
        
        {newMessage.trim() ? (
          <SendButton onClick={handleSend}>
            <Send />
          </SendButton>
        ) : (
          <IconButton sx={{ color: '#8696A0', width: 48, height: 48 }}>
            <Mic />
          </IconButton>
        )}
      </InputContainer>
    </Box>
  );
};

export default ChatWindow;
