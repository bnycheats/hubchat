import { ReactNode } from 'react';
/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function PartialLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
