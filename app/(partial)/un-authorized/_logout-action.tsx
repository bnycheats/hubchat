'use client';

import Spinner from '@/components/spinner';
import useLogout from '@/hooks/useLogout';
import { Button } from '@/components/ui/button';

function LogoutAction() {
  const { logoutMutation } = useLogout();
  return (
    <Button onClick={() => logoutMutation.mutate()} type="button" size="sm">
      {logoutMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
      Logout
    </Button>
  );
}

export default LogoutAction;
