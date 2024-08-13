'use client';

import { Fragment, useState } from 'react';
import { AiOutlineStop } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import DisableAccountAlert from '../alerts/disable-account-alert';
import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/db/queries/accounts';
import { createClient } from '@/utils/supabase/client';

export default function DisableAccountButton(props: DisableAccountButtonProps) {
  const supabase = createClient();
  const [disableAlertOpen, setDisableAlertOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['Account', props.accountId],
    queryFn: () => getAccount(supabase, props.accountId),
  });

  if (!data?.status) return null;

  return (
    <Fragment>
      <DisableAccountAlert
        accountId={props.accountId}
        open={disableAlertOpen}
        closeAlert={() => setDisableAlertOpen(false)}
      />
      <Button variant="destructive" className="rounded-full" onClick={() => setDisableAlertOpen(true)} size="sm">
        <AiOutlineStop />
        Disable Account
      </Button>
    </Fragment>
  );
}

type DisableAccountButtonProps = {
  accountId: string;
};
