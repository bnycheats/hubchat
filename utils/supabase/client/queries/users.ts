import { createClient } from '../';
import { type GetUsersPayload } from './types';

export function getUsers({ page, perPage }: GetUsersPayload) {
  return createClient().auth.admin.listUsers({ page, perPage });
}
