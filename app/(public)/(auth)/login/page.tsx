import { Fragment } from 'react';
import LoginForm from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <Fragment>
      <h1 className="mb-3 text-lg font-medium">Login</h1>
      <LoginForm />
    </Fragment>
  );
}
