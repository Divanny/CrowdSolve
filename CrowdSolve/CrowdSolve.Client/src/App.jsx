import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from './routes';
import PageLoader from '@/components/PageLoader';
import { useLanguage } from './i18n';

function App() {
  const theme = useSelector((state) => state.theme.theme);
  const isLoading = useSelector((state) => state.loading.isLoading);
  
  useLanguage();

  useEffect(() => {
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
      document.documentElement.style.colorScheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      document.documentElement.style.colorScheme = theme;
    }
  }, [theme]);

  return (
    <>
      {isLoading && <PageLoader />}
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;