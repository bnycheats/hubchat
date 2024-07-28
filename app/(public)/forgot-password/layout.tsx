import { ReactNode } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Logo from '@/assets/logo.svg';

/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return (
    <Card className="absolute left-1/2 top-1/4 w-[400px] -translate-x-1/2">
      <CardHeader className="flex items-center">
        <Image src={Logo} width={150} height={150} alt="Logo" />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export const metadata: Metadata = {
  title: 'Forgot Password',
  robots: 'noindex',
};
