'use client';

import { DATE_CALENDARS } from '../../lib/adminPrefs';
import { formatContentDateLabel } from '../../lib/content/contentDate';
import { useAdminPrefs } from './AdminPrefsProvider';

/** Fixed sample used only on Admin so calendar changes are visible without leaving the page. */
const DATE_CALENDAR_EXAMPLE = { date: '2026-07-15' };

function AdminRow({ label, hint, children, below }) {
  return (
    <div className="admin-setting-row">
      <div className="admin-setting-main">
        <div className="admin-setting-copy">
          <p className="admin-setting-label">{label}</p>
          {hint ? <p className="admin-setting-hint">{hint}</p> : null}
        </div>
        <div className="admin-setting-control">{children}</div>
      </div>
      {below ? <div className="admin-setting-below">{below}</div> : null}
    </div>
  );
}

function AdminSwitch({ checked, onChange, label }) {
  return (
    <label className="admin-switch">
      <input
        type="checkbox"
        className="admin-switch-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="admin-switch-track" aria-hidden />
      <span className="sr-only">{label}</span>
    </label>
  );
}

export default function AdminSettings() {
  const {
    debugPanelEnabled,
    setDebugPanelEnabled,
    dateCalendar,
    setDateCalendar,
    showHiddenGallery,
    setShowHiddenGallery,
  } = useAdminPrefs();

  return (
    <div className="flex-grow py-10">
      <div className="max-w-lg mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Admin</h1>
          <p className="mt-1 text-zinc-900 dark:text-zinc-50">
            Local preferences stored in this browser only.
          </p>
        </header>

        <section className="admin-settings" aria-label="Site preferences">
          <AdminRow
            label="Show debug panel"
            hint="Show the environment info block above the footer on every page."
          >
            <AdminSwitch
              checked={debugPanelEnabled}
              onChange={setDebugPanelEnabled}
              label="Show debug panel"
            />
          </AdminRow>

          <AdminRow
            label="Show hidden items"
            hint="Show blog posts, projects, and gallery cards marked hidden: true in frontmatter or YAML."
          >
            <AdminSwitch
              checked={showHiddenGallery}
              onChange={setShowHiddenGallery}
              label="Show hidden items"
            />
          </AdminRow>

          <AdminRow
            label="Change date calendar"
            hint="Reformats blog and project dates (cards and article headers) in this browser."
            below={
              <p className="admin-setting-hint admin-calendar-example" aria-live="polite">
                Example:{' '}
                {formatContentDateLabel(DATE_CALENDAR_EXAMPLE, {
                  calendar: dateCalendar,
                })}
              </p>
            }
          >
            <select
              className="admin-select"
              value={dateCalendar}
              onChange={(e) => setDateCalendar(e.target.value)}
              aria-label="Change date calendar"
            >
              {DATE_CALENDARS.map((cal) => (
                <option key={cal.id} value={cal.id}>
                  {cal.label}
                </option>
              ))}
            </select>
          </AdminRow>
        </section>
      </div>
    </div>
  );
}
