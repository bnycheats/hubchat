'use client';

import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/utils/supabase/client/auth';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Spinner from '../spinner';

function LogoutAction() {
  const { toast } = useToast();
  const { replace } = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          variant: 'destructive',
          title: data.error.message,
        });
      } else {
        replace('/');
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
  });

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
