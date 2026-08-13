import MediaGrid from './MediaGrid';

/**
 * Backward-compatible alias for navigation-first usage.
 * This wrapper intentionally fixes `mode="link"` so authors can choose component
 * names instead of remembering the `mode` prop.
 */
export default function NavigatorGrid(props) {
  return <MediaGrid {...props} mode="link" />;
}
