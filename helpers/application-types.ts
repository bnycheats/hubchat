import { z } from 'zod';
import { type StateEnums } from './types';

export enum TypeOfLeaveEnums {
  VACATION_LEAVE = 'vacation leave',
  SICK_LEAVE = 'sick leave',
  EMERGENCY_LEAVE = 'emergency leave',
  BIRTHDAY_LEAVE = 'birthday leave',
  BEREAVEMENT = 'bereavement',
  MATERNITY_LEAVE = 'maternity leave',
  PATERNAL_LEAVE = 'paternal leave',
  OTHER = 'other',
}

export type ApplicationResponse = {
  id: string;
  created_at: string;
  start_date: number;
  end_date: number;
  reason: string;
  type_of_leave: TypeOfLeaveEnums;
  file_path: string | null;
  other: string | null;
  email: string;
  state: StateEnums;
  reject_reason: string | null;
  user_id: string;
};

export const ApplyLeaveFormSchema = z.object({
  user_id: z.string().min(1, { message: 'This field is required' }),
  email: z.string().min(1, { message: 'This field is required' }),
  start_date: z.date({
    required_error: 'A date of birth is required.',
  }),
  end_date: z.date({
    required_error: 'A date of birth is required.',
  }),
  reason: z.string().min(1, { message: 'This field is required' }),
  type_of_leave: z.string().min(1, { message: 'This field is required' }),
  file: z
    .unknown()
    .transform((value) => {
      return value as FileList;
    })
    .optional(),
  other: z.string().optional(),
});
