import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * The Layout is needed to specify the page title and meta tags.
 */
export default function UpdatePasswordLayout({ children }: { children: ReactNode }) {
  return (
    <Card className="absolute left-1/2 top-1/4 w-[400px] -translate-x-1/2">
      <CardHeader>
        <h1 className="text-lg font-medium mb-3">Change Password</h1>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export const metadata: Metadata = {
  title: 'Update Password',
  robots: 'noindex',
};
