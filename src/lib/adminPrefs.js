/** Client-side admin / Easter-egg preferences (localStorage). */

export const ADMIN_PREFS_CHANGE = 'admin-prefs-change';

const DEBUG_PANEL_KEY = 'admin-debug-panel';
const DATE_CALENDAR_KEY = 'admin-date-calendar';
const SHOW_HIDDEN_GALLERY_KEY = 'admin-show-hidden-gallery';

export const DEFAULT_DATE_CALENDAR = 'gregorian';

export const DATE_CALENDARS = [
  { id: 'gregorian', label: 'Gregorian' },
  { id: 'jewish', label: 'Jewish (Hebrew)' },
  { id: 'islamic', label: 'Islamic (Hijri)' },
  { id: 'buddhist', label: 'Buddhist' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian (Hindu)' },
  { id: 'persian', label: 'Persian (Solar Hijri)' },
];

function canUseStorage() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function notifyChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(ADMIN_PREFS_CHANGE));
}

/** @returns {boolean} Default false - debug pane hidden. */
function getDebugPanelEnabled() {
  if (!canUseStorage()) return false;
  return localStorage.getItem(DEBUG_PANEL_KEY) === 'true';
}

export function setDebugPanelEnabled(enabled) {
  if (!canUseStorage()) return;
  localStorage.setItem(DEBUG_PANEL_KEY, enabled ? 'true' : 'false');
  notifyChange();
}

/** @returns {string} Calendar id from {@link DATE_CALENDARS}. */
function getDateCalendar() {
  if (!canUseStorage()) return DEFAULT_DATE_CALENDAR;
  const saved = localStorage.getItem(DATE_CALENDAR_KEY);
  if (saved && DATE_CALENDARS.some((c) => c.id === saved)) return saved;
  return DEFAULT_DATE_CALENDAR;
}

export function setDateCalendar(calendarId) {
  if (!canUseStorage()) return;
  const valid = DATE_CALENDARS.some((c) => c.id === calendarId);
  localStorage.setItem(DATE_CALENDAR_KEY, valid ? calendarId : DEFAULT_DATE_CALENDAR);
  notifyChange();
}

/** @returns {boolean} Default false - YAML `hidden` gallery items stay out of the grid. */
function getShowHiddenGallery() {
  if (!canUseStorage()) return false;
  return localStorage.getItem(SHOW_HIDDEN_GALLERY_KEY) === 'true';
}

export function setShowHiddenGallery(enabled) {
  if (!canUseStorage()) return;
  localStorage.setItem(SHOW_HIDDEN_GALLERY_KEY, enabled ? 'true' : 'false');
  notifyChange();
}

export function readAdminPrefs() {
  return {
    debugPanelEnabled: getDebugPanelEnabled(),
    dateCalendar: getDateCalendar(),
    showHiddenGallery: getShowHiddenGallery(),
  };
}
