import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { updateUserById } from '@/utils/supabase/client/functions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { type AlertDialogProps } from '@radix-ui/react-alert-dialog';
import Spinner from '@/components/spinner';
import { type AdminUserAttributes } from '@supabase/supabase-js';

function EnableUserAlert(props: EnableUserAlertProps) {
  const { userId, closeAlert, ...other } = props;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enableUserMutation = useMutation({
    mutationFn: (request: AdminUserAttributes) => updateUserById(userId, request),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'User enabled successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Users'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error enabling user: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to enable this user?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              enableUserMutation.mutate({ user_metadata: { status: true } });
            }}
          >
            {enableUserMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type EnableUserAlertProps = { userId: string; closeAlert: () => void } & AlertDialogProps;

export default EnableUserAlert;
