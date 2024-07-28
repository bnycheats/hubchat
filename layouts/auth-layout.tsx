import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Logo from '@/assets/logo.svg';
import { PropsWithChildren } from 'react';

function AuthLayout(props: PropsWithChildren) {
  return (
    <Card className="absolute left-1/2 top-1/4 w-[400px] -translate-x-1/2">
      <CardHeader className="flex items-center">
        <Image src={Logo} width={150} height={150} alt="Logo" />
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}

export default AuthLayout;
