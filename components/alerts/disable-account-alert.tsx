import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { type AlertDialogProps } from '@radix-ui/react-alert-dialog';
import Spinner from '@/components/spinner';
import { updateAccountStatus } from '@/db/actions/accounts';

function DisableAccountAlert(props: DisableAccountAlertProps) {
  const { accountId, closeAlert, ...other } = props;
  const supabase = createClient();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const disableAccountMutation = useMutation({
    mutationFn: (request: { accountId: string; status: boolean }) =>
      updateAccountStatus(supabase, request.accountId, request.status),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Account disabled successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Accounts'] });
      queryClient.invalidateQueries({ queryKey: ['Account'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error disabling account: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to disable this account?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              disableAccountMutation.mutate({ accountId, status: false });
            }}
          >
            {disableAccountMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DisableAccountAlertProps = { accountId: string; closeAlert: () => void } & AlertDialogProps;

export default DisableAccountAlert;
