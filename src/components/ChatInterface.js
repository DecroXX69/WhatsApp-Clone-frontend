import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import styled from 'styled-components';
import io from 'socket.io-client';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import WelcomeScreen from './WelcomeScreen';
import axios from 'axios';

const Container = styled(Box)`
  height: 100vh;
  width: 100vw;
  background: #111B21;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const MainContainer = styled(Paper)`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  border-radius: 0;
  box-shadow: none;
  background: #111B21;
  max-width: none;

  @media (min-width: 1200px) {
    height: calc(100vh - 40px);
    width: calc(100vw - 40px);
    max-width: 1600px;
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ChatInterface = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false); // Track if current user is typing
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    setSocket(newSocket);
    loadChats();
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (message) => {
        if (selectedChat && message.wa_id === selectedChat.wa_id) {
          setMessages(prev => [...prev, message]);
        }
        loadChats(); // Refresh chat list
      });

      socket.on('status-update', ({ message_id, status }) => {
        setMessages(prev => prev.map(msg => 
          msg.message_id === message_id ? { ...msg, status } : msg
        ));
      });

      // Listen for typing events from other users
      socket.on('user-typing', ({ wa_id, typing }) => {
        if (selectedChat && wa_id === selectedChat.wa_id) {
          // This would show typing indicator for the other person
          // For now, we'll skip this since we want to show our own typing
        }
      });
    }
  }, [socket, selectedChat]);

  const loadChats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/api/chats`);
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadMessages = async (wa_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/api/messages/${wa_id}`);
      setMessages(response.data);
      
      // Mark chat as read when opened
      await markChatAsRead(wa_id);
      
      if (socket) {
        socket.emit('join-chat', wa_id);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markChatAsRead = async (wa_id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/api/chats/${wa_id}/read`);
      // Refresh chat list to update unread counts
      loadChats();
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    loadMessages(chat.wa_id);
  };

  const sendMessage = async (text) => {
    if (!selectedChat || !text.trim()) return;

    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}/api/messages/send`, {
        wa_id: selectedChat.wa_id,
        text: text.trim()
      });
      
      // Stop typing indicator after sending
      setIsTyping(false);
      
      loadMessages(selectedChat.wa_id);
      loadChats();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTypingChange = (typing) => {
    setIsTyping(typing);
    
    // Emit typing status to other users (optional)
    if (socket && selectedChat) {
      socket.emit('typing', {
        wa_id: selectedChat.wa_id,
        typing: typing
      });
    }
  };

  return (
    <Container>
      <MainContainer elevation={0}>
        {/* Chat List - Fixed Width */}
        <Box 
          sx={{ 
            width: isMobile && selectedChat ? '0px' : { xs: '100%', md: '400px' },
            minWidth: isMobile && selectedChat ? '0px' : { xs: '100%', md: '400px' },
            borderRight: '1px solid #313D45',
            display: isMobile && selectedChat ? 'none' : 'block',
            flexShrink: 0
          }}
        >
          <ChatList 
            chats={chats}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
          />
        </Box>
        
        {/* Chat Window - Flexible Width */}
        <Box 
          sx={{ 
            flex: 1,
            display: isMobile && !selectedChat ? 'none' : 'flex',
            width: '100%'
          }}
        >
          {selectedChat ? (
            <ChatWindow 
              chat={selectedChat}
              messages={messages}
              onSendMessage={sendMessage}
              onBack={() => setSelectedChat(null)}
              isMobile={isMobile}
              isTyping={isTyping}
              onTypingChange={handleTypingChange}
            />
          ) : (
            <WelcomeScreen />
          )}
        </Box>
      </MainContainer>
    </Container>
  );
};

export default ChatInterface;
