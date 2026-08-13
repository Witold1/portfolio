'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { appVersion, buildMode } from '../lib/appVersion';
import { useCopyToClipboard } from '../lib/useCopyToClipboard';

function resolveAppRelativePath() {
  if (typeof window === 'undefined') return '-';
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
  let pathname = window.location.pathname;
  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || '/';
  }
  return `${pathname}${window.location.search}${window.location.hash}`;
}

/**
 * Collapsible environment block for bug reports (ported from DebugSection.vue).
 */
export default function DebugSection({ lastRenderMs = null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { copied: copyDone, copy } = useCopyToClipboard(2000);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });
  const [screenSize, setScreenSize] = useState({ w: 0, h: 0 });
  const [appPath, setAppPath] = useState('-');
  const [lastError, setLastError] = useState(null);
  const [theme, setTheme] = useState('light');

  const updateSizesAndTheme = useCallback(() => {
    if (typeof window === 'undefined') return;
    setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    setScreenSize({ w: window.screen.width, h: window.screen.height });
    const resolved = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const pref = document.documentElement.dataset.themePref || resolved;
    setTheme(pref === resolved ? resolved : `${pref}→${resolved}`);
  }, []);

  useEffect(() => {
    updateSizesAndTheme();
    window.addEventListener('resize', updateSizesAndTheme);
    const mo = new MutationObserver(updateSizesAndTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme-pref'],
    });
    return () => {
      window.removeEventListener('resize', updateSizesAndTheme);
      mo.disconnect();
    };
  }, [updateSizesAndTheme]);

  const refreshAppPath = useCallback(() => {
    setAppPath(resolveAppRelativePath());
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    refreshAppPath();
    router.events.on('routeChangeComplete', refreshAppPath);
    window.addEventListener('popstate', refreshAppPath);
    window.addEventListener('hashchange', refreshAppPath);
    return () => {
      router.events.off('routeChangeComplete', refreshAppPath);
      window.removeEventListener('popstate', refreshAppPath);
      window.removeEventListener('hashchange', refreshAppPath);
    };
  }, [router, router.isReady, refreshAppPath]);

  useEffect(() => {
    const onError = (event) => {
      const err = event.error || event;
      setLastError({
        message: event.message || err?.message || String(event),
        stack: err?.stack || '',
      });
    };
    const onUnhandledRejection = (event) => {
      const reason = event.reason;
      setLastError({
        message: reason?.message || String(reason),
        stack: reason?.stack || '',
      });
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  const technicalLines = useMemo(() => {
    const v = viewportSize;
    const s = screenSize;
    const lines = [
      { key: 'viewport', value: `${v.w} × ${v.h}` },
      { key: 'screen', value: `${s.w} × ${s.h}` },
      {
        key: 'devicePixelRatio',
        value: typeof window !== 'undefined' ? String(window.devicePixelRatio ?? '') : '-',
      },
      {
        key: 'timezone',
        value: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '-',
      },
      {
        key: 'language',
        value: typeof navigator !== 'undefined' ? navigator.language : '-',
      },
      { key: 'theme', value: theme },
    ];
    if (lastRenderMs != null) {
      lines.push({ key: 'lastRenderMs', value: `${Number(lastRenderMs).toFixed(1)} ms` });
    }
    if (lastError) {
      lines.push({ key: 'lastError', value: lastError.message });
      if (lastError.stack) {
        lines.push({ key: 'lastErrorStack', value: lastError.stack });
      }
    }
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      lines.push({ key: 'userAgent', value: navigator.userAgent });
    }
    return lines;
  }, [viewportSize, screenSize, theme, lastRenderMs, lastError]);

  const appLines = useMemo(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '-';
    return [
      { key: 'version', value: appVersion },
      { key: 'buildMode', value: buildMode },
      { key: 'basePath', value: basePath },
      { key: 'path', value: appPath },
    ];
  }, [appPath]);

  const copyText = useMemo(() => {
    const blocks = [
      ['[Environment]', technicalLines],
      ['[App]', appLines],
    ];
    return blocks
      .map(([heading, lines]) =>
        [heading, ...lines.map(({ key, value }) => `${key}: ${value}`)].join('\n')
      )
      .join('\n\n');
  }, [technicalLines, appLines]);

  const clearError = () => setLastError(null);

  const copyToClipboard = async () => {
    await copy(copyText);
  };

  return (
    <aside className="debug-section px-4" aria-label="Environment debug (for bug reports)">
      <div className="mx-auto max-w-5xl">
        <div className="debug-section-inner">
          <button
            type="button"
            className="debug-toggle"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Hide' : 'Show'} environment info (for bug reports)
          </button>
          {open ? (
            <div className="debug-panel">
              <div className="debug-block">
                <span className="debug-block-heading">Environment</span>
                <div className="debug-lines">
                  {technicalLines.map((line) => (
                    <div key={`tech-${line.key}`} className="debug-line">
                      <span className="debug-key">{line.key}:</span>
                      <span className="debug-value">{line.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="debug-block">
                <span className="debug-block-heading">App</span>
                <div className="debug-lines">
                  {appLines.map((line) => (
                    <div key={`app-${line.key}`} className="debug-line">
                      <span className="debug-key">{line.key}:</span>
                      <span className="debug-value">{line.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {lastError ? (
                <div className="debug-error-actions">
                  <button type="button" className="debug-link" onClick={clearError}>
                    Clear last error
                  </button>
                </div>
              ) : null}
              <button type="button" className="debug-link" onClick={copyToClipboard}>
                {copyDone ? 'Copied!' : 'Copy to clipboard'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
