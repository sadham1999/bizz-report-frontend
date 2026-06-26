import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
 <ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
 </ThemeProvider>
);
