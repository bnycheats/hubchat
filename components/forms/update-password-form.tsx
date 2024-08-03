'use client';

import { updatePassword } from '@/db/client/actions/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import Password from '@/components/password';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

const FormSchema = z
  .object({
    newPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords does not match',
  });

export default function UpdatePasswordForm() {
  const { toast } = useToast();

  const defaultValues: z.infer<typeof FormSchema> = {
    newPassword: '',
    confirmPassword: '',
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (request: z.infer<typeof FormSchema>) => updatePassword(request.newPassword),
    onSuccess: () => {
      form.reset();
      toast({
        variant: 'success',
        title: 'Your password has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => updatePasswordMutation.mutate(data);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onPressSubmit)}>
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <Password {...field} placeholder="New password*" disabled={updatePasswordMutation.isPending} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <Password {...field} placeholder="Re-enter your password*" disabled={updatePasswordMutation.isPending} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mb-2 rounded-full w-full">
          {updatePasswordMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
          Change Password
        </Button>
      </form>
    </Form>
  );
}
