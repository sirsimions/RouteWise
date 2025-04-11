import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import JourneyPlanner from './components/JourneyPlanner';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontSize: 12, // Smaller base font for mobile screens
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          overflowX: 'hidden', // Prevent horizontal scroll
        },
        '*': {
          boxSizing: 'border-box',
        },
        '@media (max-width: 600px)': {
          body: {
            fontSize: '12px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-4 sm:p-2">
          <JourneyPlanner />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
