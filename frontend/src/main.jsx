// frontend/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#0056A4" },   // Blue
    secondary: { main: "#178A4E" }, // Green
    error: { main: "#E63946" },     // Red
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#4F4F4F",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'IBM Plex Sans', 'Source Sans Pro', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "0.5px",
      color: "#0056A4",
    },
    subtitle2: {
      color: "#178A4E",
    },
  },
  components: {
MuiAppBar: {
  styleOverrides: {
    root: {
      backgroundColor: "#e4e0e0ff", // matches theme.paper
      color: "#0056A4",           // your primary blue
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
  },
},

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          padding: "0 24px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
        },
        containedPrimary: {
          background: "linear-gradient(90deg, #0056A4, #178A4E)",
          color: "#fff",
          "&:hover": {
            background: "linear-gradient(90deg, #004080, #126b3a)",
          },
        },
        containedSecondary: {
          backgroundColor: "#178A4E",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#126b3a",
          },
        },
        outlinedPrimary: {
          borderColor: "#0056A4",
          color: "#0056A4",
          "&:hover": {
            backgroundColor: "rgba(0, 86, 164, 0.1)",
          },
        },
        outlinedSecondary: {
          borderColor: "#178A4E",
          color: "#178A4E",
          "&:hover": {
            backgroundColor: "rgba(23, 138, 78, 0.1)",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&.Mui-selected": {
            backgroundColor: "rgba(23, 138, 78, 0.15)", // subtle green highlight
            color: "#178A4E",
            fontWeight: 600,
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(23, 138, 78, 0.25)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          color: "#0056A4",
          fontWeight: 600,
          "&.active": {
            color: "#178A4E",
            borderBottom: "2px solid #178A4E",
          },
        },
      },
    },
  },
});


export default theme;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <App />
    </ThemeProvider>
  </StrictMode>,
)
