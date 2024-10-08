'use client';

import { forgotPassword } from '@/db/actions/auth';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { z } from 'zod';

import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function ForgotPasswordForm() {
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (request: z.infer<typeof FormSchema>) => forgotPassword(supabase, request.email),
    onSuccess: () => {
      form.reset();
      toast({
        variant: 'success',
        title: 'Password reset email sent. Please check your inbox.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => forgotPasswordMutation.mutate(data);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} type="email" placeholder="Email Address*" />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-center">
          <Button className="mb-2 rounded-full w-full">
            {forgotPasswordMutation.isPending && <Spinner className="h-5 w-5 text-white" />}
            Send Reset Link
          </Button>
          <Link href="/login">
            <Button type="button" className="h-auto p-0" variant="link">
              Back to login
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
