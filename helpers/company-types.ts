import { z } from 'zod';

export type CompanyResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  owner_name: string;
  company_name: string;
  currency: string;
  commission_rate: number;
  expenses_rate: number;
  over_time_rate: number;
  per_hour_rate: number;
  per_day_rate: number;
  per_month_rate: number;
  status: boolean;
};

export const CompanyFormSchema = z.object({
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
