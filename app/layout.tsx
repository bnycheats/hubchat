import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

import QueryProvider from '@/context/query-provider';
import './globals.css';
import 'react-day-picker/dist/style.css';
import AuthProvider from '@/context/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
