import { useMutation } from '@tanstack/react-query';
import { logout } from '@/app/(public)/(auth)/login/actions';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

function useLogout() {
  const { toast } = useToast();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
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
