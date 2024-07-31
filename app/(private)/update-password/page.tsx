import UpdatePasswordForm from '@/components/forms/update-password-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function UpdatePasswordPage() {
  return (
    <Card className="absolute left-1/2 top-1/4 w-[400px] -translate-x-1/2">
      <CardHeader>
        <h1 className="text-lg font-medium mb-3">Change Password</h1>
      </CardHeader>
      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
}
