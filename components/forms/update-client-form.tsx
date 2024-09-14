'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import currencies from '@/constants/currencies';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/spinner';
import convertAmountToCents from '@/utils/convertAmountToCents';
import convertCentsToAmount from '@/utils/convertCentsToAmount';
import { updateClient } from '@/db/actions/clients';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import Message from '@/components/message';
import { ClientFormSchema, type ClientResponse } from '@/helpers/client-types';
import { getClient } from '@/db/queries/clients';
import { notFound } from 'next/navigation';

export default function UpdateClientForm(props: UpdateClientFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ['Client', props.clientId],
    queryFn: () => getClient(supabase, props.clientId),
  });

  const client = data as ClientResponse;

  const defaultValues: z.infer<typeof ClientFormSchema> = {
    ...client,
    per_day_rate: convertCentsToAmount(Number(client.per_day_rate)),
    per_hour_rate: convertCentsToAmount(Number(client.per_hour_rate)),
    per_month_rate: convertCentsToAmount(Number(client.per_month_rate)),
  };

  const form = useForm<z.infer<typeof ClientFormSchema>>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues,
  });

  const updateClientMutation = useMutation({
    mutationFn: (payload: z.infer<typeof ClientFormSchema>) => updateClient(supabase, props.clientId, payload),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Client updated successfully',
      });
      form.reset(form.watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
      queryClient.invalidateQueries({ queryKey: ['Clients'] });
      queryClient.invalidateQueries({ queryKey: ['Client'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: error.message,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof ClientFormSchema>> = (payload) =>
    updateClientMutation.mutate({
      ...payload,
      over_time_rate: convertAmountToCents(Number(payload.over_time_rate)),
      per_day_rate: convertAmountToCents(Number(payload.per_day_rate)),
      per_hour_rate: convertAmountToCents(Number(payload.per_hour_rate)),
      per_month_rate: convertAmountToCents(Number(payload.per_month_rate)),
    });

  if (!data) return notFound();

  if (!data.status) {
    return (
      <Message
        title="Client Disabled"
        message="Client has been disabled. Please contact support for more information."
      />
    );
  }

  return (
    <Form {...form}>
      {(updateClientMutation.isPending || isLoading) && <Spinner centered fullScreen />}
      <form className="mt-4 grid grid-cols-2 gap-6" onSubmit={form.handleSubmit(onPressSubmit)}>
        <FormField
          control={form.control}
          name="owner_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner name</FormLabel>
              <Input {...field} placeholder="Owner name*" />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <Input {...field} placeholder="Company name*" />
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
        <div className="col-span-2 flex justify-end gap-3">
          <Button className="rounded-full w-28" type="submit" disabled={!form.formState.isDirty}>
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}

type UpdateClientFormProps = {
  clientId: string;
};
