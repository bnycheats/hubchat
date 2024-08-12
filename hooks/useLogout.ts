import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/db/actions/auth-server';
import { useToast } from '@/components/ui/use-toast';

function useLogout() {
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: () => signOut(),
    onSuccess: (data) => {
      if (data?.error) {
        toast({
          variant: 'destructive',
          title: data.error.message,
        });
      }
    },
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
