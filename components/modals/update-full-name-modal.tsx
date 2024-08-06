'use client';

import { updateProfileUserMetaData } from '@/db/actions/auth';
import { createClient } from '@/utils/supabase/client';
import useAuth from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { type UserMetadata } from '@/helpers/auth-types';

const FormSchema = z.object({
  first_name: z.string().min(1, { message: 'This field is required' }),
  last_name: z.string().min(1, { message: 'This field is required' }),
});

function UpdateFullNameModal(props: UpdateFullNameModalProps) {
  const { closeModal, ...other } = props;
  const { toast } = useToast();
  const { session } = useAuth();
  const supabase = createClient();

  const userMetaData = session?.user.user_metadata as UserMetadata;

  const defaultValues: z.infer<typeof FormSchema> = {
    first_name: userMetaData?.first_name ?? '',
    last_name: userMetaData?.last_name ?? '',
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const updateFullNameMutation = useMutation({
    mutationFn: (request: z.infer<typeof FormSchema>) => updateProfileUserMetaData(supabase, request),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: "User's full name updated successfully",
      });
      form.reset(form.watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
      closeModal();
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error updating user's full name: ${error}`,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (payload) => updateFullNameMutation.mutate(payload);

  return (
    <Dialog
      {...other}
      onOpenChange={() => {
        form.reset();
        closeModal();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-2">Update full name</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onPressSubmit)}>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <Input {...field} placeholder="First name*" disabled={updateFullNameMutation.isPending} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <Input {...field} placeholder="Last name*" disabled={updateFullNameMutation.isPending} />
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
              <Button
                className="rounded-full"
                type="submit"
                disabled={updateFullNameMutation.isPending || !form.formState.isDirty}
              >
                {updateFullNameMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type UpdateFullNameModalProps = {
  closeModal: () => void;
} & DialogProps;

export default UpdateFullNameModal;
