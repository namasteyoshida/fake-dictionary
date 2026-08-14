import type { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export function PageLayout({ title, children }: Props) {
  return (
    <div className="page-layout">
      {title && <h1 className="page-title">{title}</h1>}
      <div className="page-content">{children}</div>
    </div>
  );
}
