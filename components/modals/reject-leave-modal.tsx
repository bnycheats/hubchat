'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-dialog';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Fragment, useState } from 'react';
import RejectLeaveAlert from '../alerts/reject-leave-alert';

const FormSchema = z.object({
  reject_reason: z.string().min(1, { message: 'This field is required' }),
});

function RejectLeaveModal(props: RejectLeaveModalProps) {
  const { closeModal, applicationId, ...other } = props;

  const [rejectLeaveOpen, setRejectLeaveOpen] = useState(false);

  const defaultValues: z.infer<typeof FormSchema> = {
    reject_reason: '',
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof FormSchema>> = () => setRejectLeaveOpen(true);

  return (
    <Fragment>
      <RejectLeaveAlert
        applicationId={applicationId}
        rejectReason={form.getValues('reject_reason')}
        open={rejectLeaveOpen}
        closeAlert={() => setRejectLeaveOpen(false)}
      />
      <Dialog
        {...other}
        onOpenChange={() => {
          form.reset();
          closeModal();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-2">Reject Leave</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onPressSubmit)}>
              <FormField
                control={form.control}
                name="reject_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reject reason</FormLabel>
                    <Textarea {...field} placeholder="Reject reason*" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="rounded-full" type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button className="rounded-full" type="submit" disabled={!form.formState.isDirty}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

type RejectLeaveModalProps = {
  applicationId: string;
  closeModal: () => void;
} & DialogProps;

export default RejectLeaveModal;
