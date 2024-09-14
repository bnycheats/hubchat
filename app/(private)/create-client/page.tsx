import CreateClientForm from '@/components/forms/create-client-form';
import FullScreenModal from '@/components/full-sreen-modal';

export default function CreateClientPage() {
  return (
    <FullScreenModal path="/clients">
      <h2 className="text-3xl">Create Client</h2>
      <CreateClientForm />
    </FullScreenModal>
  );
}
