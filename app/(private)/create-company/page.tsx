import CreateCompanyForm from '@/components/forms/create-company-form';
import FullScreenModal from '@/components/full-sreen-modal';

export default function CreateCompanyPage() {
  return (
    <FullScreenModal path="/companies">
      <h2 className="text-3xl">Create Company</h2>
      <CreateCompanyForm />
    </FullScreenModal>
  );
}
