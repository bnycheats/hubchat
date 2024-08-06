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
import { createCompany } from '@/db/actions/companies';
import { createClient } from '@/utils/supabase/client';

export const FormSchema = z.object({
  owner_name: z.string().min(1, { message: 'This field is required' }),
  company_name: z.string().min(1, { message: 'This field is required' }),
  currency: z.string().min(3, { message: 'This field is required' }),
  commission_rate: z
    .preprocess(Number, z.number().multipleOf(0.01, { message: 'Maximum two decimal places allowed.' }))
    .or(z.literal('')),
  expenses_rate: z
    .preprocess(Number, z.number().multipleOf(0.01, { message: 'Maximum two decimal places allowed.' }))
    .or(z.literal('')),
  over_time_rate: z
    .preprocess(Number, z.number().multipleOf(0.01, { message: 'Maximum two decimal places allowed.' }))
    .or(z.literal('')),
  per_hour_rate: z
    .preprocess(Number, z.number().multipleOf(0.01, { message: 'Maximum two decimal places allowed.' }))
    .or(z.literal('')),
  per_day_rate: z
    .preprocess(Number, z.number().multipleOf(0.01, { message: 'Maximum two decimal places allowed.' }))
    .or(z.literal('')),
  per_month_rate: z
    .preprocess(Number, z.number().multipleOf(0.01, { message: 'Maximum two decimal places allowed.' }))
    .or(z.literal('')),
});

export default function CreateCompanyForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const defaultValues: z.infer<typeof FormSchema> = {
    owner_name: '',
    company_name: '',
    currency: '',
    commission_rate: '',
    expenses_rate: '',
    over_time_rate: '',
    per_hour_rate: '',
    per_day_rate: '',
    per_month_rate: '',
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const createCompanyMutation = useMutation({
    mutationFn: (payload: z.infer<typeof FormSchema>) => createCompany(supabase, payload),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Company created successfully',
      });
      form.reset(form.watch(), {
        keepValues: false,
        keepDirty: false,
        keepDefaultValues: false,
      });
      queryClient.invalidateQueries({ queryKey: ['Companies'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: error.message,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (payload) =>
    createCompanyMutation.mutate({
      ...payload,
      per_day_rate: convertAmountToCents(Number(payload.per_day_rate)),
      per_hour_rate: convertAmountToCents(Number(payload.per_hour_rate)),
      per_month_rate: convertAmountToCents(Number(payload.per_month_rate)),
    });

  return (
    <Form {...form}>
      {createCompanyMutation.isPending && <Spinner centered fullScreen />}
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
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
