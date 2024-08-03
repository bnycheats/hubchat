import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { updateUserById } from '@/db/client/actions/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { type AlertDialogProps } from '@radix-ui/react-alert-dialog';
import Spinner from '@/components/spinner';
import { type AdminUserAttributes } from '@supabase/supabase-js';

function DisableUserAlert(props: DisableUserAlertProps) {
  const { userId, closeAlert, ...other } = props;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const disableUserMutation = useMutation({
    mutationFn: (request: AdminUserAttributes) => updateUserById(userId, request),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'User disabled successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Users'] });
      queryClient.invalidateQueries({ queryKey: ['User'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error disabling user: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to disable this user?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              disableUserMutation.mutate({ user_metadata: { status: false } });
            }}
          >
            {disableUserMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DisableUserAlertProps = { userId: string; closeAlert: () => void } & AlertDialogProps;

export default DisableUserAlert;
