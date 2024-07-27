'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
// import { login } from '@/firebase/client/mutations/auth';
// import { type LoginPayloadType } from '@/firebase/client/mutations/auth/types';

import Password from '@/components/password';
import Spinner from '@/components/spinner';
// import { handleLoginError } from '@/errors/login-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Fragment } from 'react';
import Link from 'next/link';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  rememberMe: z.boolean().default(false),
});

export default function LoginPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  //   const loginMutation = useMutation({
  //     mutationFn: (request: LoginPayloadType) => login(request),
  //     onError: (error: any) =>
  //       toast({
  //         variant: 'destructive',
  //         title: handleLoginError(error.code),
  //       }),
  //   });

  //   const onSubmit: SubmitHandler<LoginPayloadType> = (data) => loginMutation.mutate(data);

  return (
    <Fragment>
      <h1 className="mb-3 text-lg font-medium">Login</h1>
      <Form {...form}>
        {/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> */}
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                {/* <Input {...field} type="email" placeholder="Email Address*" disabled={loginMutation.isPending} /> */}
                <Input {...field} type="email" placeholder="Email Address*" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                {/* <Password {...field} placeholder="Password*" disabled={loginMutation.isPending} /> */}
                <Password {...field} placeholder="Password*" />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="remember-me" />
                    <label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                </FormItem>
              )}
            />
            <Link href="/forgot-password">
              <Button type="button" className="h-auto p-0" variant="link">
                Forgot Password?
              </Button>
            </Link>
          </div>
          {/* <Button className="w-full" disabled={loginMutation.isPending}> */}
          <Button className="w-full">
            {/* {loginMutation.isPending && <Spinner className="h-5 w-5 text-white" />} */}
            Login
          </Button>
        </form>
      </Form>
    </Fragment>
  );
}
