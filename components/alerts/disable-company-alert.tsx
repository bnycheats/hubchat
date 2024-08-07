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
import { updateCompanyStatus } from '@/db/actions/companies';

function DisableCompanyAlert(props: DisableCompanyAlertProps) {
  const { companyId, closeAlert, ...other } = props;
  const supabase = createClient();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const disableCompanyMutation = useMutation({
    mutationFn: (request: { companyId: string; status: boolean }) =>
      updateCompanyStatus(supabase, request.companyId, request.status),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Company disabled successfully',
      });
      closeAlert();
      queryClient.invalidateQueries({ queryKey: ['Companies'] });
      queryClient.invalidateQueries({ queryKey: ['Company'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error disabling company: ${error}`,
      }),
  });

  return (
    <AlertDialog {...other} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to disable this company?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              disableCompanyMutation.mutate({ companyId, status: false });
            }}
          >
            {disableCompanyMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type DisableCompanyAlertProps = { companyId: string; closeAlert: () => void } & AlertDialogProps;

export default DisableCompanyAlert;