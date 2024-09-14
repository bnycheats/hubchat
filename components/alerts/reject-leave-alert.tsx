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

function RejectLeaveAlert(props: RejectLeaveAlertProps) {
  const { applicationId, rejectReason, closeAlert, ...other } = props;
  const supabase = createClient();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rejectLeaveMutation = useMutation({
    mutationFn: (request: { applicationId: string }) =>
      updateLeaveStatus(supabase, request.applicationId, StateEnums.REJECTED, rejectReason),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Reject leave successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Applications'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error rejecting leave: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to reject this leave?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              rejectLeaveMutation.mutate({ applicationId });
            }}
          >
            {rejectLeaveMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type RejectLeaveAlertProps = { applicationId: string; rejectReason: string; closeAlert: () => void } & AlertDialogProps;

export default RejectLeaveAlert;
