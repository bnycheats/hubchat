import { Fragment } from 'react';
import ForgotPasswordForm from '@/components/forms/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <Fragment>
      <div className="mb-3">
        <h1 className="text-lg font-medium">Forgot Password</h1>
        <small>Insert your account email and we’ll send you a reset link.</small>
      </div>
      <ForgotPasswordForm />
    </Fragment>
  );
}
