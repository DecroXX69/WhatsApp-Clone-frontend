import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatInterface from './components/ChatInterface';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#128C7E',
      light: '#25D366',
      dark: '#075E54',
    },
    secondary: {
      main: '#DCF8C6',
      light: '#E8F5E8',
    },
    background: {
      default: '#111B21',
      paper: '#202C33', // ← Changed from #FFFFFF to prevent override
      chat: '#0B141A',
      chatList: '#111B21',
      message: '#ECE5DD',
    },
    text: {
      primary: '#E9EDEF',
      secondary: '#8696A0',
      tertiary: '#667781',
    },
    grey: {
      50: '#F7F8FA',
      100: '#F0F2F5',
      200: '#E4E6EA',
      300: '#D1D7DB',
      800: '#41525D',
      900: '#111B21',
    }
  },
  typography: {
    fontFamily: "'Segoe UI', 'Helvetica Neue', 'SF Pro Display', sans-serif",
    h6: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.3,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.2,
    },
    caption: {
      fontSize: '0.6875rem',
      color: '#667781',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '24px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '24px',
            backgroundColor: '#2A3942',
            border: 'none',
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #00A884',
            },
          },
          '& .MuiInputBase-input': {
            color: '#E9EDEF',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#8696A0',
          },
        },
      },
    },
    // ← Add this to override Paper component globally
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent', // This prevents the white background override
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ChatInterface />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
