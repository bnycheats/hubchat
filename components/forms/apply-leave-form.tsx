'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import typeOfLeaves from '@/constants/type-of-leaves';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { format, isBefore, setHours, setMinutes, subDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ApplyLeaveFormSchema } from '@/helpers/application-types';
import Spinner from '@/components/spinner';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { getUsers } from '@/db/queries/auth';
import { Textarea } from '../ui/textarea';
import { applyLeave } from '@/db/actions/applications';

export default function ApplyLeaveForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [open, setOpen] = useState(false);

  const { data, isLoading: usersLoading } = useQuery({
    queryKey: ['Users'],
    queryFn: () => getUsers(supabase),
  });

  const defaultValues: z.infer<typeof ApplyLeaveFormSchema> = {
    user_id: '',
    email: '',
    start_date: new Date(),
    end_date: new Date(),
    file: undefined,
    other: '',
    reason: '',
    type_of_leave: '',
  };

  const form = useForm<z.infer<typeof ApplyLeaveFormSchema>>({
    resolver: zodResolver(ApplyLeaveFormSchema),
    defaultValues,
  });

  const fileRef = form.register('file');

  const applyLeaveMutation = useMutation({
    mutationFn: (request: z.infer<typeof ApplyLeaveFormSchema>) => applyLeave(supabase, request),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Leave application filed successfully',
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['Applications'] });
    },
    onError: (error: any) =>
      toast({
        variant: 'destructive',
        title: error.message,
      }),
  });

  const onPressSubmit: SubmitHandler<z.infer<typeof ApplyLeaveFormSchema>> = (payload) =>
    applyLeaveMutation.mutate(payload);

  return (
    <div>
      {(applyLeaveMutation.isPending || usersLoading) && <Spinner centered fullScreen />}

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
                                  form.setValue('email', user?.email ?? '');
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
              name="type_of_leave"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of leave</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type of leave*" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOfLeaves.map((item, index) => (
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
            {form.watch('type_of_leave') === 'other' && (
              <FormField
                control={form.control}
                name="other"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Other</FormLabel>
                    <Input {...field} placeholder="Other*" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
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
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(setMinutes(setHours(date, 12), 0));
                            if (isBefore(form.watch('end_date'), date)) {
                              form.setValue('end_date', setMinutes(setHours(date, 23), 59));
                            }
                          }
                        }}
                        disabled={(date) => date < subDays(new Date(), 1) || date < new Date('1900-01-01')}
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
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
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
                        onSelect={(date) => date && field.onChange(setMinutes(setHours(date, 23), 59))}
                        disabled={(date) =>
                          date < subDays(new Date(), 1) ||
                          date < form.watch('start_date') ||
                          date < new Date('1900-01-01')
                        }
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
              name="reason"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Reason</FormLabel>
                  <Textarea {...field} placeholder="Reason*" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem className="col-span-2">
                  <FormLabel>Please attach here any supporting documents (like medical certificate, etc.)</FormLabel>
                  <FormControl>
                    <Input type="file" placeholder="" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2 flex justify-end gap-3">
              <Button className="rounded-full w-28" type="submit" disabled={!form.formState.isDirty}>
                Apply
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
