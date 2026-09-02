'use client';

import DebugSection from './DebugSection';
import { useAdminPrefs } from './admin/AdminPrefsProvider';

export default function DebugSectionGate() {
  const { debugPanelEnabled } = useAdminPrefs();
  if (!debugPanelEnabled) return null;
  return <DebugSection />;
}
