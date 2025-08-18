// /src/styles/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    // The new "Deep Focus" palette
    primary: {
      main: '#007BFF', // electricBlue
    },
    secondary: {
      main: '#10B981', // vibrantGreen (for success/profit)
    },
    error: {
      main: '#EF4444', // warningRed
    },
    background: {
      default: '#121212', // charcoal
      paper: '#1E1E1E',   // midnight (for elevated surfaces)
    },
    text: {
      primary: '#F1F1F1', // offWhite
      secondary: '#888888', // mutedGrey
    },
    divider: '#333333', // slate
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#121212', // Match the base background
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});