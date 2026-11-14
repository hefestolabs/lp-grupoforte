import Link from 'next/link';

// Link interno (começa com "/") usa a navegação do Next; o resto é um <a> comum.
export default function SmartLink({ href, children, ...rest }) {
  if (typeof href === 'string' && href.startsWith('/'))
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  return (
    <a href={href || '#'} {...rest}>
      {children}
    </a>
  );
}
