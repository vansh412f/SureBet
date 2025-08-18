// /src/styles/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4299E1', // Bright blue for interactive elements
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#48BB78', // Bright green for profit/accent
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#1A202C', // Very dark grey background
      paper: '#2D3748', // Slightly lighter dark grey for content/tables
    },
    text: {
      primary: '#E2E8F0', // Light grey for primary text
      secondary: '#A0AEC0', // Slightly darker grey for secondary text
    },
    success: {
      main: '#48BB78', // Green for positive values
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F56565', // Red for negative values
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#4299E1',
          '&:hover': {
            backgroundColor: '#3182CE',
          },
        },
        outlined: {
          borderColor: '#4299E1',
          color: '#4299E1',
          '&:hover': {
            borderColor: '#3182CE',
            backgroundColor: 'rgba(66, 153, 225, 0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#4A5568',
          color: '#E2E8F0',
        },
        head: {
          backgroundColor: '#2D3748',
          color: '#E2E8F0',
          fontWeight: 700,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(66, 153, 225, 0.05)',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#4299E1',
          '&.Mui-checked': {
            color: '#4299E1',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#4299E1',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2D3748',
          backgroundImage: 'none',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#E2E8F0',
    },
    h5: {
      fontWeight: 600,
      color: '#E2E8F0',
    },
    h6: {
      fontWeight: 600,
      color: '#E2E8F0',
    },
    body1: {
      color: '#E2E8F0',
    },
    body2: {
      color: '#A0AEC0',
    },
  },
});