'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import roles from '@/constants/roles';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import currencies from '@/constants/currencies';
import { Input } from '@/components/ui/input';
import ClientDetailsSection from '../sections/client-details-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { createAccount } from '@/db/actions/accounts';
import { AccountFormSchema } from '@/helpers/account-types';
import Spinner from '@/components/spinner';
import { useQuery } from '@tanstack/react-query';
import convertAmountToCents from '@/utils/convertAmountToCents';
import { createClient } from '@/utils/supabase/client';
import { getClients } from '@/db/queries/clients';
import { cn } from '@/lib/utils';
import { getUsers } from '@/db/queries/auth';
import { useSearchParams } from 'next/navigation';

export default function CreateAccountForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const { data, isLoading: usersLoading } = useQuery({
    queryKey: ['Users'],
    queryFn: () => getUsers(supabase),
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['Clients'],
    queryFn: () => getClients(supabase),
  });

  const defaultValues: z.infer<typeof AccountFormSchema> = {
    user_id: searchParams.get('userId') ?? '',
    client_id: '',
    currency: '',
    account_name: '',
    commission_rate: '',
    expenses_rate: '',
    over_time_rate: '',
    per_hour_rate: '',
    per_day_rate: '',
    per_month_rate: '',
    role: '',
  };

  const form = useForm<z.infer<typeof AccountFormSchema>>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues,
  });

  const client = clients?.data?.find((item) => item.id === form.watch('client_id'));

  const createAccountMutation = useMutation({
    mutationFn: (request: z.infer<typeof AccountFormSchema>) => createAccount(supabase, request),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Account created successfully',
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['Accounts'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: error.message,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof AccountFormSchema>> = (payload) => {
    const { over_time_rate, per_day_rate, per_hour_rate, per_month_rate, ...other } = payload;
    createAccountMutation.mutate({
      over_time_rate: convertAmountToCents(Number(payload.over_time_rate)),
      per_day_rate: convertAmountToCents(Number(payload.per_day_rate)),
      per_hour_rate: convertAmountToCents(Number(payload.per_hour_rate)),
      per_month_rate: convertAmountToCents(Number(payload.per_month_rate)),
      ...other,
    });
  };

  useEffect(() => {
    if (client) {
      form.setValue('currency', client.currency, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [client, form]);

  return (
    <div>
      {(createAccountMutation.isPending || usersLoading || clientsLoading) && <Spinner centered fullScreen />}
      {client && <ClientDetailsSection {...client} />}
      <section>
        <Form {...form}>
          <form className="mt-4 grid grid-cols-2 gap-6" onSubmit={form.handleSubmit(onPressSubmit)}>
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select user email</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? data?.users?.find((user) => user.id === field.value)?.email
                            : 'Select user email*'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search user email..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {data?.users.map((user) => (
                              <CommandItem
                                value={user.email}
                                key={user.id}
                                onSelect={() => {
                                  form.setValue('user_id', user.id);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn('mr-2 h-4 w-4', user.id === field.value ? 'opacity-100' : 'opacity-0')}
                                />
                                {user.email}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.data?.map((item, index) => (
                        <SelectItem key={index} value={item.id}>
                          {item.owner_name}
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
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(currencies).map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item}
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
              name="account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account name</FormLabel>
                  <Input {...field} placeholder="Account name*" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commission_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel>Commission rate</FormLabel>
                    <span className="text-xs text-primary bottom-0 absolute right-0">Optional</span>
                  </div>
                  <Input {...field} type="number" placeholder="Commission rate" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expenses_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel>Company Expenses rate</FormLabel>
                    <span className="text-xs text-primary bottom-0 absolute right-0">Optional</span>
                  </div>
                  <Input {...field} type="number" placeholder="Company expenses rate" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="over_time_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel>Over time rate</FormLabel>
                    <span className="text-xs text-primary bottom-0 absolute right-0">Optional</span>
                  </div>
                  <Input {...field} type="number" placeholder="Over time rate" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="per_hour_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel>Per hour rate</FormLabel>
                    <span className="text-xs text-primary bottom-0 absolute right-0">Optional</span>
                  </div>
                  <Input {...field} type="number" placeholder="Per hour rate" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="per_day_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel>Per day rate</FormLabel>
                    <span className="text-xs text-primary bottom-0 absolute right-0">Optional</span>
                  </div>
                  <Input {...field} type="number" placeholder="Per day rate" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="per_month_rate"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <FormLabel>Per month rate</FormLabel>
                    <span className="text-xs text-primary bottom-0 absolute right-0">Optional</span>
                  </div>
                  <Input {...field} type="number" placeholder="Per month rate" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex justify-end gap-3">
              <Button className="rounded-full w-28" type="submit" disabled={!form.formState.isDirty}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
