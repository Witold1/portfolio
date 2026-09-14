import Link from 'next/link';
import { getLinkBrand, isExternalUrl } from '../../lib/isExternalUrl';
import BrandLinkIcon from '../content/BrandLinkIcon';

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function MdxLink({ href = '', className = '', children, ...rest }) {
  const external = isExternalUrl(href);
  const brand = getLinkBrand(href);
  const mergedClassName = joinClasses(
    'mdx-link',
    external ? 'mdx-link--external' : 'mdx-link--internal',
    brand ? `mdx-link--${brand.modifier}` : '',
    className
  );

  const body = (
    <>
      {brand ? (
        <BrandLinkIcon name={brand.icon} wordmark={brand.wordmark} variant="mdx" />
      ) : null}
      {children}
    </>
  );

  if (external) {
    const target = rest.target || '_blank';
    const rel = rest.rel || 'noopener noreferrer';
    return (
      <a href={href} className={mergedClassName} target={target} rel={rel} {...rest}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={mergedClassName} {...rest}>
      {body}
    </Link>
  );
}
