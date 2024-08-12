import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/db/actions/auth-server';
import { useToast } from '@/components/ui/use-toast';

function useLogout() {
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: () => signOut(),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
  });

  return { logoutMutation };
}

export default useLogout;
