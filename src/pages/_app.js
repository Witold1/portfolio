import '../styles/globals.css';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DebugSectionGate from '../components/DebugSectionGate';
import ScrollToTop from '../components/ScrollToTop';
import { AdminPrefsProvider } from '../components/admin/AdminPrefsProvider';
import {
  applyThemePreference,
  readStoredPreference,
} from '../lib/theme';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    applyThemePreference(readStoredPreference());

    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onSystemChange = () => {
      if (readStoredPreference() === 'system') {
        applyThemePreference('system');
      }
    };
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onSystemChange);
      return () => media.removeEventListener('change', onSystemChange);
    }
    media.addListener(onSystemChange);
    return () => media.removeListener(onSystemChange);
  }, []);

  return (
    <AdminPrefsProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Component {...pageProps} />
        </div>
        <DebugSectionGate />
        <Footer />
        <ScrollToTop />
      </div>
    </AdminPrefsProvider>
  );
}
