import { slugifyHeading } from '../../lib/content/toc';

function makeHeading(Tag) {
  const baseClass = `mdx-heading mdx-heading-${Tag}`;
  return function Heading({ children, className = '', id: idProp, ...props }) {
    const text = Array.isArray(children) ? children.join('') : children;
    const id = idProp || slugifyHeading(text);
    const merged = [baseClass, className].filter(Boolean).join(' ');
    return (
      <Tag {...props} id={id} className={merged}>
        {children}
      </Tag>
    );
  };
}

export const H2 = makeHeading('h2');
export const H3 = makeHeading('h3');
export const H4 = makeHeading('h4');
