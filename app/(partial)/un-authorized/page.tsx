import { createClient } from '@/utils/supabase/server';
import AuthLayout from '@/layouts/auth-layout';

import LogoutAction from './logout-action';

export default async function UnAuthorizedPage() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <AuthLayout>
      <h1 className="mb-3 text-lg font-medium">Hi {user?.email}</h1>
      <p>We are sorry but you are not authorized to access this tool. Please contact your developer.</p>
      <div className="text-right mt-4">
        <LogoutAction />
      </div>
    </AuthLayout>
  );
}
