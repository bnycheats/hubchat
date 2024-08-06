'use client';

import { updateUserRoles } from '@/db/actions/auth';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { useToast } from '@/components/ui/use-toast';
import roles from '@/constants/roles';
import { type RolesEnums } from '@/helpers/types';

const FormSchema = z.object({
  user_role: z.array(z.string()).min(1, { message: 'This field is required' }),
});

function UpdateUserRolesModal(props: UpdateUserRolesModalProps) {
  const { closeModal, userRoles, userId, ...other } = props;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const defaultValues: z.infer<typeof FormSchema> = {
    user_role: userRoles,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const updateUserRolesMutation = useMutation({
    mutationFn: (request: z.infer<typeof FormSchema>) =>
      updateUserRoles(supabase, userId, request.user_role as Array<RolesEnums>),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: "User's roles updated successfully",
      });
      form.reset(form.watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
      queryClient.invalidateQueries({ queryKey: ['Users'] });
      queryClient.invalidateQueries({ queryKey: ['User'] });
      closeModal();
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: `Error updating user's roles: ${error?.message}`,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (payload) => updateUserRolesMutation.mutate(payload);

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
          <DialogTitle className="mb-2">Update user roles</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onPressSubmit)}>
            <FormField
              control={form.control}
              name="user_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <MultiSelect options={roles} selected={field.value ?? []} onChange={field.onChange} />
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
                disabled={updateUserRolesMutation.isPending || !form.formState.isDirty}
              >
                {updateUserRolesMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type UpdateUserRolesModalProps = {
  closeModal: () => void;
  userRoles: RolesEnums[];
  userId: string;
} & DialogProps;

export default UpdateUserRolesModal;
