'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Spinner from '../spinner';
import useLogout from '@/hooks/useLogout';

function LogoutAction() {
  const { logoutMutation } = useLogout();
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        logoutMutation.mutate();
      }}
    >
      Logout{logoutMutation.isPending && <Spinner className="ml-1 h-4 w-4" />}
    </DropdownMenuItem>
  );
}

export default LogoutAction;
