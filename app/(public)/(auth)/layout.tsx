import { ReactNode } from 'react';
import AuthLayout from '@/layouts/auth-layout';
/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function PublicAuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
