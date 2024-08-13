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

function EnableAccountAlert(props: EnableAccountAlertProps) {
  const { accountId, closeAlert, ...other } = props;
  const supabase = createClient();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const enableAccountMutation = useMutation({
    mutationFn: (request: { accountId: string; status: boolean }) =>
      updateAccountStatus(supabase, request.accountId, request.status),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Account enabled successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Accounts'] });
      queryClient.invalidateQueries({ queryKey: ['Account'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error enabling account: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to enable this account?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              enableAccountMutation.mutate({ accountId, status: true });
            }}
          >
            {enableAccountMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type EnableAccountAlertProps = { accountId: string; closeAlert: () => void } & AlertDialogProps;

export default EnableAccountAlert;
