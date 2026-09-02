import Link from 'next/link';
import { isExternalUrl } from '../../lib/isExternalUrl';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function MdxLink({ href = '', className = '', children, ...rest }) {
  const external = isExternalUrl(href);
  const mergedClassName = joinClasses(
    'mdx-link',
    external ? 'mdx-link--external' : 'mdx-link--internal',
    className
  );

  if (external) {
    const target = rest.target || '_blank';
    const rel = rest.rel || 'noopener noreferrer';
    return (
      <a href={href} className={mergedClassName} target={target} rel={rel} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={mergedClassName} {...rest}>
      {children}
    </Link>
  );
}
