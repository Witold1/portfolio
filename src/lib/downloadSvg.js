function svgFilenameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const base = pathname.split('/').pop() || 'image.svg';
    return /\.svg$/i.test(base) ? base : `${base}.svg`;
  } catch {
    return 'image.svg';
  }
}

/** Fetch an SVG and trigger a file download (Files on iOS, Downloads on desktop). */
export async function downloadSvgFromUrl(url, filename) {
  if (typeof url !== 'string' || !url.trim()) {
    throw new Error('Missing SVG URL');
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status})`);
  }

  const blob = await response.blob();
  const name = filename || svgFilenameFromUrl(url);
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}

export function isSvgMediaUrl(src) {
  return typeof src === 'string' && /\.svg(\?|$)/i.test(src.trim());
}
