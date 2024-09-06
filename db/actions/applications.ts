import { z } from 'zod';
import { ApplyLeaveFormSchema } from '@/helpers/application-types';
import { SupabaseClient } from '@supabase/supabase-js';
import { StateEnums } from '@/helpers/types';

export async function applyLeave(supabase: SupabaseClient, payload: z.infer<typeof ApplyLeaveFormSchema>) {
  try {
    const { start_date, end_date, file, ...rest } = payload;
    let fileUrl = '';

    if (file?.[0]) {
      const { data, error } = await supabase.storage
        .from('applications')
        .upload(`certificates/${rest.user_id}/${file[0].name}`, file[0]);
      if (error) {
        console.error('Error uploading file:', error.message);
        throw error;
      }
      fileUrl = data.path;
    }

    const newPayload = {
      ...rest,
      start_date: start_date.getTime(),
      end_date: end_date.getTime(),
      file_path: fileUrl,
      state: StateEnums.PENDING,
    };

    const { error, data } = await supabase.from('applications').insert(newPayload);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateLeaveStatus(supabase: SupabaseClient, applicationId: string, state: StateEnums) {
  try {
    const { error, data } = await supabase.from('applications').update({ state }).eq('id', applicationId);
    if (error) {
      throw error;
    }
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
