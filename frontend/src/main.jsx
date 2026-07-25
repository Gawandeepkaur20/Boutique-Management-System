import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { store } from './redux/store';
import { useMuiTheme } from './hooks/useMuiTheme';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Must be inside <Provider> because useMuiTheme uses useSelector
const AppProviders = () => {
  const theme = useMuiTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProviders />
    </Provider>
  </React.StrictMode>
);
