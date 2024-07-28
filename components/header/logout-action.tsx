'use client';

import useLogout from '@/hooks/useLogout';
import Spinner from '@/components/spinner';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function LogoutAction() {
  const { logoutMutation } = useLogout();
  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        logoutMutation.mutate();
      }}
    >
      Logout
      {logoutMutation.isPending && <Spinner className="ml-2 h-5 w-5" />}
    </DropdownMenuItem>
  );
}
