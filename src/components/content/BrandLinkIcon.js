import ToolbarIcon from './ToolbarIcon';

/** Leading brand glyph + word joiner so underline/wrapping stay attached to the label. */
export default function BrandLinkIcon({ name, wordmark = false, variant = 'mdx' }) {
  const base = variant === 'content' ? 'content-link-brand-icon' : 'mdx-link-brand-icon';
  return (
    <>
      <ToolbarIcon
        name={name}
        className={`${base}${wordmark ? ` ${base}--wordmark` : ''}`}
      />
      {'\u2060'}
    </>
  );
}
