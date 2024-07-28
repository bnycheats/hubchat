import { createClient } from '@/utils/supabase/server';
import LogoutAction from './_logout-action';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Logo from '@/assets/logo.svg';

export default async function UnAuthorizedPage() {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  return (
    <Card className="absolute left-1/2 top-1/4 w-[400px] -translate-x-1/2">
      <CardHeader className="flex items-center">
        <Image src={Logo} width={150} height={150} alt="Logo" />
      </CardHeader>
      <CardContent>
        <h1 className="mb-3 text-lg font-medium">Hi {user?.email}</h1>
        <p>We are sorry but you are not authorized to access this tool. Please contact your developer.</p>
        <div className="text-center mt-4">
          <LogoutAction />
        </div>
      </CardContent>
    </Card>
  );
}
