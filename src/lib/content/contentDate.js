import { DEFAULT_DATE_CALENDAR } from '../adminPrefs';

/** Maps admin pref ids to Intl `calendar` option values. */
const CONTENT_DATE_CALENDAR_INTL = {
  gregorian: 'gregory',
  jewish: 'hebrew',
  islamic: 'islamic',
  buddhist: 'buddhist',
  chinese: 'chinese',
  indian: 'indian',
  persian: 'persian',
};

function parseContentDateParts(date) {
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return { year: date.getFullYear(), month: date.getMonth() + 1 };
  }

  if (date != null && date !== '') {
    const match = String(date).trim().match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
    if (match) {
      const y = parseInt(match[1], 10);
      const m = match[2] ? parseInt(match[2], 10) : null;
      if (Number.isFinite(y)) {
        return {
          year: y,
          month: m && m >= 1 && m <= 12 ? m : null,
        };
      }
    }
  }

  return null;
}

function formatGregorianMonthYear(year, month) {
  const monthName = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' });
  return `${monthName} ${year}`;
}

function anchorUtcDate({ year, month }) {
  // Mid-month when month is known; Jan 1 when only a year is available.
  const m = month || 1;
  const d = month ? 15 : 1;
  return new Date(Date.UTC(year, m - 1, d));
}

function formatWithIntlCalendar(parts, calendarId) {
  const intlCalendar = CONTENT_DATE_CALENDAR_INTL[calendarId];
  if (!intlCalendar) return null;

  const utcDate = anchorUtcDate(parts);
  const options = {
    calendar: intlCalendar,
    year: 'numeric',
    timeZone: 'UTC',
  };
  if (parts.month) options.month = 'long';

  return new Intl.DateTimeFormat('en-US', options).format(utcDate);
}

/**
 * Shared Blog / Projects date period - "July 2026" when month is known, otherwise "2026".
 * Pass `calendar` from admin prefs for the Easter egg (defaults to Gregorian).
 */
export function formatContentPeriodLabel(
  fields = {},
  { calendar = DEFAULT_DATE_CALENDAR } = {},
) {
  const parts = parseContentDateParts(fields.date);
  if (!parts) return '';

  let label = '';
  if (!calendar || calendar === 'gregorian') {
    label = parts.month
      ? formatGregorianMonthYear(parts.year, parts.month)
      : String(parts.year);
  } else {
    try {
      label = formatWithIntlCalendar(parts, calendar) || '';
    } catch {
      // fall through to Gregorian
    }
    if (!label) {
      label = parts.month
        ? formatGregorianMonthYear(parts.year, parts.month)
        : String(parts.year);
    }
  }

  return label;
}

/**
 * Created line - "Created during July 2026" when month is known,
 * otherwise "Created during 2026".
 */
export function formatContentDateLabel(fields = {}, options = {}) {
  const period = formatContentPeriodLabel(fields, options);
  return period ? `Created during ${period}` : '';
}

/**
 * Optional revisit line from frontmatter `edited` or `polished` (ISO-like date).
 * Prefer `polished` when both are set - softer label for long-gap cleanups.
 */
export function formatContentEditedLabel(fields = {}, options = {}) {
  const polished =
    typeof fields.polished === 'string' ? fields.polished.trim() : fields.polished;
  const edited = typeof fields.edited === 'string' ? fields.edited.trim() : fields.edited;
  const raw = polished || edited;
  if (raw == null || raw === '') return '';

  const period = formatContentPeriodLabel({ date: raw }, options);
  if (!period) return '';
  return polished ? `Polished during ${period}` : `Edited during ${period}`;
}

/** Page meta: created, optional edited/polished, optional version (separate rows). */
export function formatContentMetaParts(fields = {}, options = {}) {
  const dateLabel = formatContentDateLabel(fields, options);
  const editedLabel = formatContentEditedLabel(fields, options);
  const raw = typeof fields.version === 'string' ? fields.version.trim() : '';
  const versionLabel = raw ? `version ${raw}` : '';
  return { dateLabel, editedLabel, versionLabel };
}

/** Flat meta string (tests / callers that want one line). Prefer `formatContentMetaParts` for UI. */
export function formatContentMetaLine(fields = {}, options = {}) {
  const { dateLabel, editedLabel, versionLabel } = formatContentMetaParts(fields, options);
  return [dateLabel, editedLabel, versionLabel].filter(Boolean).join(', ');
}
