import { ReactNode } from 'react';
import { Metadata } from 'next';
import AuthLayout from '@/layouts/auth-layout';

/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

export const metadata: Metadata = {
  title: 'Login',
  robots: 'noindex',
};
