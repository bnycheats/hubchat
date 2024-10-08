'use client';

import provinces from '@/constants/provinces';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import TooltipInfo from '@/components/tooltip-info';
import Spinner from '@/components/spinner';
import Message from '@/components/message';
import { type UserMetadata } from '@/helpers/auth-types';
import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/db/queries/auth';
import { updateUserById } from '@/db/actions/auth';
import { createClient } from '@/utils/supabase/client';
import { type User } from '@supabase/supabase-js';

const FormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  first_name: z.string().min(1, { message: 'This field is required' }),
  last_name: z.string().min(1, { message: 'This field is required' }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  user_role: z.array(z.string()).min(1, { message: 'This field is required' }),
  phone_number: z.string().min(1, { message: 'This field is required' }),
  street: z.string().min(1, { message: 'This field is required' }),
  province: z.string().min(1, { message: 'This field is required' }),
  postal_code: z.string().min(1, { message: 'This field is required' }),
});

export default function UpdateUserForm(props: UpdateUserFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ['User', props.userId],
    queryFn: () => getUser(supabase, props.userId),
  });

  const user = data?.user as User;
  const userMetaData = user?.user_metadata as UserMetadata;

  const defaultValues: z.infer<typeof FormSchema> = {
    ...userMetaData,
    dob: userMetaData ? new Date(userMetaData.dob) : new Date(),
    email: data?.user?.email ?? '',
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const updateUserMutation = useMutation({
    mutationFn: (request: z.infer<typeof FormSchema>) => {
      return updateUserById(supabase, user.id ?? '', { user_metadata: request });
    },
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'User details updated successfully',
      });
      form.reset(form.watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
      queryClient.invalidateQueries({ queryKey: ['Users'] });
      queryClient.invalidateQueries({ queryKey: ['User'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: error.message,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (payload) => updateUserMutation.mutate(payload);

  if (!user) return notFound();

  if (!userMetaData.status) {
    return (
      <Message title="User Disabled" message="User has been disabled. Please contact support for more information." />
    );
  }

  return (
    <Form {...form}>
      {(updateUserMutation.isPending || isLoading) && <Spinner centered fullScreen />}
      <form className="mt-4 grid grid-cols-2 gap-6" onSubmit={form.handleSubmit(onPressSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="relative">
                Email
                <span className="absolute top-1/2 -translate-y-1/2 -right-2/3">
                  <TooltipInfo infoText="Email can't be change, ask the developer to change it" />
                </span>
              </FormLabel>
              <Input {...field} type="email" placeholder="Email Address*" disabled />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <Input {...field} placeholder="First name*" />
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
              <Input {...field} placeholder="Last name*" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <Input {...field} placeholder="Phone number*" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal code</FormLabel>
              <Input {...field} placeholder="Postal code*" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select province*" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces.map((item, index) => (
                    <SelectItem key={index} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <Textarea {...field} placeholder="Street*" />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2 flex justify-end gap-3">
          <Button className="rounded-full w-28" type="submit" disabled={!form.formState.isDirty}>
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

type UpdateUserFormProps = {
  userId: string;
};
