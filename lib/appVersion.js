/** Mirrors Vue `config/appVersion` - values inlined at build time for the debug panel. */
export const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';

export const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
