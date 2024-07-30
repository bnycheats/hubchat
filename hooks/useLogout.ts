import { useMutation } from '@tanstack/react-query';
import { signOut } from '@/utils/supabase/server/functions';
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
