import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTheme } from '../redux/slices/themeSlice';

export const useThemeInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    dispatch(setTheme(saved));
    document.documentElement.classList.toggle('dark', saved === 'dark');
  }, [dispatch]);
};
