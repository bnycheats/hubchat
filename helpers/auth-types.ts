import { type RolesEnums } from './types';

export type UserMetadata = {
  first_name: string;
  last_name: string;
  dob: number;
  phone_number: string;
  province: string;
  street: string;
  postal_code: string;
  user_role: Array<RolesEnums>;
  status: boolean;
};

export type Credential = {
  email: string;
  password: string;
};
