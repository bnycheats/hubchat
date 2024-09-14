'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import roles from '@/constants/roles';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import currencies from '@/constants/currencies';
import { Input } from '@/components/ui/input';
import ClientDetailsSection from '../sections/client-details-section';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateAccount } from '@/db/actions/accounts';
import { AccountFormSchema, type AccountResponse } from '@/helpers/account-types';
import Spinner from '@/components/spinner';
import { useQuery } from '@tanstack/react-query';
import convertAmountToCents from '@/utils/convertAmountToCents';
import convertCentsToAmount from '@/utils/convertCentsToAmount';
import { createClient } from '@/utils/supabase/client';
import { getClients } from '@/db/queries/clients';
import { getAccount } from '@/db/queries/accounts';
import { notFound } from 'next/navigation';
import Message from '../message';
import Clipboard from '../clip-board';

export default function UpdateAccountForm(props: UpdateAccountFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['Clients'],
    queryFn: () => getClients(supabase),
  });

  const { data, isLoading: accountLoading } = useQuery({
    queryKey: ['Account', props.accountId],
    queryFn: () => getAccount(supabase, props.accountId),
  });

  const account = data as AccountResponse;

  const defaultValues: z.infer<typeof AccountFormSchema> = {
    ...account,
    over_time_rate: convertCentsToAmount(Number(account.over_time_rate)),
    per_day_rate: convertCentsToAmount(Number(account.per_day_rate)),
    per_hour_rate: convertCentsToAmount(Number(account.per_hour_rate)),
    per_month_rate: convertCentsToAmount(Number(account.per_month_rate)),
  };

  const form = useForm<z.infer<typeof AccountFormSchema>>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues,
  });

  const client = clients?.data?.find((item) => item.id === form.watch('client_id'));

  const updateAccountMutation = useMutation({
    mutationFn: (request: z.infer<typeof AccountFormSchema>) => updateAccount(supabase, props.accountId, request),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Account updated successfully',
      });
      form.reset(form.watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
      queryClient.invalidateQueries({ queryKey: ['Accounts'] });
      queryClient.invalidateQueries({ queryKey: ['Account'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: error.message,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof AccountFormSchema>> = (payload) => {
    const { over_time_rate, per_day_rate, per_hour_rate, per_month_rate, ...other } = payload;
    updateAccountMutation.mutate({
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

  if (!data) return notFound();

  if (!data.status) {
    return (
      <Message
        title="Account Disabled"
        message="Account has been disabled. Please contact support for more information."
      />
    );
  }

  return (
    <div>
      {(updateAccountMutation.isPending || clientsLoading || accountLoading) && <Spinner centered fullScreen />}
      {client && <ClientDetailsSection {...client} />}
      <section>
        <Form {...form}>
          <form className="mt-4 grid grid-cols-2 gap-6" onSubmit={form.handleSubmit(onPressSubmit)}>
            <div className="col-span-2">
              <label className="font-semibold">User id</label>
              <Clipboard value={account.user_id}>{account.user_id}</Clipboard>
            </div>
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}

type UpdateAccountFormProps = {
  accountId: string;
};
