'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  ADMIN_PREFS_CHANGE,
  DEFAULT_DATE_CALENDAR,
  readAdminPrefs,
  setDateCalendar as persistDateCalendar,
  setDebugPanelEnabled as persistDebugPanel,
  setShowHiddenGallery as persistShowHiddenGallery,
} from '../../lib/adminPrefs';

const SSR_DEFAULT_PREFS = {
  debugPanelEnabled: false,
  dateCalendar: DEFAULT_DATE_CALENDAR,
  showHiddenGallery: false,
};

const AdminPrefsContext = createContext(null);

export function AdminPrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(SSR_DEFAULT_PREFS);

  const refresh = useCallback(() => {
    setPrefs(readAdminPrefs());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(ADMIN_PREFS_CHANGE, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(ADMIN_PREFS_CHANGE, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const setDebugPanelEnabled = useCallback((enabled) => {
    persistDebugPanel(enabled);
    setPrefs(readAdminPrefs());
  }, []);

  const setDateCalendar = useCallback((calendarId) => {
    persistDateCalendar(calendarId);
    setPrefs(readAdminPrefs());
  }, []);

  const setShowHiddenGallery = useCallback((enabled) => {
    persistShowHiddenGallery(enabled);
    setPrefs(readAdminPrefs());
  }, []);

  const value = useMemo(
    () => ({
      debugPanelEnabled: prefs.debugPanelEnabled,
      setDebugPanelEnabled,
      dateCalendar: prefs.dateCalendar,
      setDateCalendar,
      showHiddenGallery: prefs.showHiddenGallery,
      setShowHiddenGallery,
    }),
    [prefs, setDebugPanelEnabled, setDateCalendar, setShowHiddenGallery]
  );

  return <AdminPrefsContext.Provider value={value}>{children}</AdminPrefsContext.Provider>;
}

export function useAdminPrefs() {
  const ctx = useContext(AdminPrefsContext);
  if (!ctx) {
    throw new Error('useAdminPrefs must be used within AdminPrefsProvider');
  }
  return ctx;
}
