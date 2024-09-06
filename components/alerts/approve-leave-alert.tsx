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
import { updateLeaveStatus } from '@/db/actions/applications';
import { StateEnums } from '@/helpers/types';

function ApproveLeaveAlert(props: ApproveLeaveAlertProps) {
  const { applicationId, closeAlert, ...other } = props;
  const supabase = createClient();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveLeaveMutation = useMutation({
    mutationFn: (request: { applicationId: string }) =>
      updateLeaveStatus(supabase, request.applicationId, StateEnums.APPROVED),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Approve leave successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Applications'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error approving leave: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to approve this leave?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              approveLeaveMutation.mutate({ applicationId });
            }}
          >
            {approveLeaveMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type ApproveLeaveAlertProps = { applicationId: string; closeAlert: () => void } & AlertDialogProps;

export default ApproveLeaveAlert;
