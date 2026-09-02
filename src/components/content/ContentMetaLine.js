'use client';

import { useAdminPrefs } from '../admin/AdminPrefsProvider';
import { formatContentMetaLine } from '../../lib/content/contentDate';

/** Date / year / optional version line that reacts to the admin calendar Easter egg. */
export default function ContentMetaLine({ date, year, version }) {
  const { dateCalendar } = useAdminPrefs();
  const line = formatContentMetaLine({ date, year, version }, { calendar: dateCalendar });
  if (!line) return null;
  return <>{line}</>;
}
