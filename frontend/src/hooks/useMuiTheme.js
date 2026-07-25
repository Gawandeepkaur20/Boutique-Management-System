import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

export const useMuiTheme = () => {
  const mode = useSelector((state) => state.theme.mode);

  return createTheme({
    palette: {
      mode,
      primary: { main: '#c026d3' },
      secondary: { main: '#86198f' },
    },
    typography: { fontFamily: 'Inter, system-ui, sans-serif' },
    shape: { borderRadius: 12 },
  });
};
