'use client';

import { Button } from '@/components/ui/button';
import useLogout from '@/hooks/useLogout';
import Spinner from '@/components/spinner';

export default function LogoutAction() {
  const { logoutMutation } = useLogout();
  return (
    <Button onClick={() => logoutMutation.mutate()} size="sm">
      {logoutMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
      Logout
    </Button>
  );
}
