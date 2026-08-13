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

function parseContentDateParts(date, year) {
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

  if (year != null && year !== '') {
    const y = Number(year);
    if (Number.isFinite(y)) return { year: y, month: null };
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
 * Shared Blog / Projects date display - "Created during July 2026" when month is known,
 * otherwise "Created during 2026". Pass `calendar` from admin prefs for the Easter egg
 * (defaults to Gregorian).
 */
export function formatContentDateLabel(
  fields = {},
  { calendar = DEFAULT_DATE_CALENDAR } = {},
) {
  const parts = parseContentDateParts(fields.date, fields.year);
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

  return `Created during ${label}`;
}

/** Page meta line: date label plus optional project version. */
export function formatContentMetaLine(fields = {}, options = {}) {
  const segments = [formatContentDateLabel(fields, options)];
  if (fields.version) segments.push(`v${fields.version}`);
  return segments.filter(Boolean).join(', ');
}
