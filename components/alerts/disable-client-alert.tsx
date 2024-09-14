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
import { updateClientStatus } from '@/db/actions/clients';

function DisableClientAlert(props: DisableClientAlertProps) {
  const { clientId, closeAlert, ...other } = props;
  const supabase = createClient();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const disableClientMutation = useMutation({
    mutationFn: (request: { clientId: string; status: boolean }) =>
      updateClientStatus(supabase, request.clientId, request.status),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Client disabled successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Clients'] });
      queryClient.invalidateQueries({ queryKey: ['Client'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error disabling client: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to disable this client?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              disableClientMutation.mutate({ clientId, status: false });
            }}
          >
            {disableClientMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DisableClientAlertProps = { clientId: string; closeAlert: () => void } & AlertDialogProps;

export default DisableClientAlert;
