'use client';

import { useAdminPrefs } from '../admin/AdminPrefsProvider';
import { formatContentMetaParts } from '../../lib/content/contentDate';

/** Created / optional edited|polished / optional version - reacts to admin calendar Easter egg. */
export default function ContentMetaLine({ created, edited, polished, version }) {
  const { dateCalendar } = useAdminPrefs();
  const { dateLabel, editedLabel, versionLabel } = formatContentMetaParts(
    { created, edited, polished, version },
    { calendar: dateCalendar }
  );
  if (!dateLabel && !editedLabel && !versionLabel) return null;

  return (
    <>
      {dateLabel ? <span className="content-meta-line__created">{dateLabel}</span> : null}
      {editedLabel ? <span className="content-meta-line__edited">{editedLabel}</span> : null}
      {versionLabel ? <span className="content-meta-line__version">{versionLabel}</span> : null}
    </>
  );
}
