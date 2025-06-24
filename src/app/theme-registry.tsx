'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { darkTheme, lightTheme } from '@/theme/theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const appliedTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
