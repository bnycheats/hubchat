'use client';

import { Fragment, useState } from 'react';
import { AiOutlineStop } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import DisableCompanyAlert from '../alerts/disable-company-alert';
import { useQuery } from '@tanstack/react-query';
import { getCompany } from '@/db/queries/companies';
import { createClient } from '@/utils/supabase/client';

export default function DisableCompanyButton(props: DisableCompanyButtonProps) {
  const supabase = createClient();
  const [disableCompanyOpen, setDisableCompanyOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['Company', props.companyId],
    queryFn: () => getCompany(supabase, props.companyId),
  });

  if (!data?.status) return null;

  return (
    <Fragment>
      <DisableCompanyAlert
        companyId={props.companyId}
        open={disableCompanyOpen}
        closeAlert={() => setDisableCompanyOpen(false)}
      />
      <Button variant="destructive" className="rounded-full" onClick={() => setDisableCompanyOpen(true)} size="sm">
        <AiOutlineStop />
        Disable Company
      </Button>
    </Fragment>
  );
}

type DisableCompanyButtonProps = {
  companyId: string;
};
