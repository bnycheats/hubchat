import CreateUserForm from '@/components/forms/create-user-form';
import FullScreenModal from '@/components/full-sreen-modal';

export default function CreateUserPage() {
  return (
    <FullScreenModal path="/users">
      <h2 className="text-3xl">Create User</h2>
      <CreateUserForm />
    </FullScreenModal>
  );
}
