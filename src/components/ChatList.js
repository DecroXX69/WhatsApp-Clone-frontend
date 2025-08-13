import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import { 
  Search, 
  Person, 
  MoreVert,
  Chat,
  DonutLarge
} from '@mui/icons-material';
import styled from 'styled-components';
import moment from 'moment';

const Header = styled(Box)`
  background: #2A3942;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #313D45;
  min-height: 70px;
`;

const ProfileSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconsSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchContainer = styled(Box)`
  padding: 8px 12px;
  background: #111B21;
  border-bottom: 1px solid #313D45;
`;

const FiltersContainer = styled(Box)`
  padding: 12px 16px;
  background: #111B21;
  border-bottom: 1px solid #313D45;
  display: flex;
  gap: 8px;
`;

const ChatListContainer = styled(Box)`
  height: calc(100% - 200px);
  overflow-y: auto;
  background: #111B21;
`;

const StyledListItem = styled(ListItem)`
  padding: 12px 16px !important;
  border-bottom: 1px solid rgba(49, 61, 69, 0.5);
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: #2A3942;
  }
  
  &.selected {
    background-color: #2A3942;
    border-right: 3px solid #00A884;
  }

  &:active {
    background-color: #374248;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 48px !important;
  height: 48px !important;
  background: linear-gradient(135deg, #667781 0%, #8696A0 100%);
  border: 2px solid #313D45;
`;

const ChatMetaContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 4px;
`;

const ChatContentContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ChatList = ({ chats, selectedChat, onChatSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filters = ['All', 'Unread', 'Groups', 'Contacts'];

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Unread' && chat.unread_count > 0);
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);
    
    if (now.diff(messageTime, 'days') === 0) {
      return messageTime.format('HH:mm');
    } else if (now.diff(messageTime, 'days') === 1) {
      return 'Yesterday';
    } else if (now.diff(messageTime, 'days') < 7) {
      return messageTime.format('dddd');
    } else {
      return messageTime.format('DD/MM/YYYY');
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#111B21' }}>
      <Header>
        <ProfileSection>
          <StyledAvatar>
            <Person sx={{ color: '#E9EDEF' }} />
          </StyledAvatar>
          <Typography variant="h6" sx={{ color: '#E9EDEF', fontWeight: 500 }}>
            WhatsApp
          </Typography>
        </ProfileSection>
        
        <IconsSection>
          <IconButton sx={{ color: '#8696A0' }}>
            <DonutLarge />
          </IconButton>
          <IconButton sx={{ color: '#8696A0' }}>
            <Chat />
          </IconButton>
          <IconButton sx={{ color: '#8696A0' }} onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </IconsSection>
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
        <MenuItem onClick={handleMenuClose}>New group</MenuItem>
        <MenuItem onClick={handleMenuClose}>New community</MenuItem>
        <MenuItem onClick={handleMenuClose}>Starred messages</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      </Menu>
      
      <SearchContainer>
        <TextField
          fullWidth
          size="small"
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#8696A0', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#2A3942',
              color: '#E9EDEF',
              fontSize: '0.875rem',
              height: '40px',
              '& input::placeholder': {
                color: '#8696A0',
                opacity: 1,
              }
            }
          }}
        />
      </SearchContainer>

      <FiltersContainer>
        {filters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? "filled" : "outlined"}
            sx={{
              backgroundColor: activeFilter === filter ? '#00A884' : '#2A3942',
              color: activeFilter === filter ? '#111B21' : '#E9EDEF',
              borderColor: '#313D45',
              fontSize: '0.75rem',
              height: '28px',
              '&:hover': {
                backgroundColor: activeFilter === filter ? '#00A884' : '#374248',
              }
            }}
          />
        ))}
      </FiltersContainer>
      
      <ChatListContainer>
        <List sx={{ padding: 0 }}>
          {filteredChats.map((chat) => (
            <StyledListItem
              key={chat.wa_id}
              onClick={() => onChatSelect(chat)}
              className={selectedChat?.wa_id === chat.wa_id ? 'selected' : ''}
            >
              <ListItemAvatar>
                <StyledAvatar>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#E9EDEF' }}>
                    {getInitials(chat.name)}
                  </Typography>
                </StyledAvatar>
              </ListItemAvatar>
              
              <ListItemText
                sx={{ margin: 0 }}
                primary={
                  <ChatMetaContainer>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: chat.unread_count > 0 ? 600 : 400,
                        color: '#E9EDEF',
                        fontSize: '1rem',
                        lineHeight: 1.2,
                        flex: 1
                      }}
                    >
                      {chat.name}
                    </Typography>
                    {chat.last_message?.timestamp && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: chat.unread_count > 0 ? '#00A884' : '#8696A0',
                          fontSize: '0.6875rem',
                          fontWeight: chat.unread_count > 0 ? 500 : 400,
                          marginLeft: 1
                        }}
                      >
                        {formatTime(chat.last_message.timestamp)}
                      </Typography>
                    )}
                  </ChatMetaContainer>
                }
                secondary={
                  <ChatContentContainer>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#8696A0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: chat.unread_count > 0 ? '180px' : '220px',
                        fontSize: '0.8125rem',
                        fontWeight: chat.unread_count > 0 ? 400 : 300,
                        flex: 1
                      }}
                    >
                      {chat.last_message?.text || 'No messages yet'}
                    </Typography>
                    {chat.unread_count > 0 && (
                      <Badge
                        badgeContent={chat.unread_count > 99 ? '99+' : chat.unread_count}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#00A884',
                            color: '#111B21',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            minWidth: '20px',
                            height: '20px',
                            borderRadius: '10px'
                          }
                        }}
                      />
                    )}
                  </ChatContentContainer>
                }
              />
            </StyledListItem>
          ))}
        </List>
      </ChatListContainer>
    </Box>
  );
};

export default ChatList;
