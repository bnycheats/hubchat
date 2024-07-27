import { ReactNode } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Logo from '@/assets/logo.svg';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { data } = await createClient().auth.getSession();
  if (data.session) {
    redirect('/dashboard');
  }
  return (
    <Card className="absolute left-1/2 top-1/4 w-[400px] -translate-x-1/2">
      <CardHeader className="flex items-center">
        <Image src={Logo} width={150} height={150} alt="Logo" />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
