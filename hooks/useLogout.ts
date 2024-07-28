import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/utils/supabase/client/auth';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

function useLogout() {
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
        replace('/login');
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
