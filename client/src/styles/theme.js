import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#3B82F6', dark: '#2563EB', light: '#60A5FA' },
    secondary:  { main: '#10B981', dark: '#059669', light: '#34D399' },
    warning:    { main: '#F59E0B', dark: '#D97706', light: '#FCD34D' },
    error:      { main: '#EF4444', dark: '#DC2626', light: '#FCA5A5' },
    success:    { main: '#10B981', dark: '#059669', light: '#34D399' },
    background: {
      default: '#07070F',
      paper:   '#0D0D1A',
    },
    text: {
      primary:   '#F1F5F9',
      secondary: '#94A3B8',
      disabled:  '#475569',
    },
    divider: 'rgba(255,255,255,0.07)',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h6:   { fontWeight: 700 },
    body1:{ fontSize: '0.9rem' },
    body2:{ fontSize: '0.82rem' },
    caption: { fontSize: '0.75rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.35); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.55); }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#94A3B8',
          backgroundColor: '#07070F',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '12px 16px',
        },
        body: {
          fontSize: '0.875rem',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          padding: '14px 16px',
          verticalAlign: 'top',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 0.2s ease',
          '&:hover': { background: 'rgba(59,130,246,0.04)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.72rem' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1A1A2E',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          fontSize: '0.78rem',
        },
        arrow: { color: '#1A1A2E' },
      },
    },
  },
});