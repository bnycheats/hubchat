'use client';

import { Fragment, useState } from 'react';
import { AiOutlineStop } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import DisableClientAlert from '../alerts/disable-client-alert';
import { useQuery } from '@tanstack/react-query';
import { getClient } from '@/db/queries/clients';
import { createClient } from '@/utils/supabase/client';

export default function DisableClientButton(props: DisableClientButtonProps) {
  const supabase = createClient();
  const [disableClientOpen, setDisableClientOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['Client', props.clientId],
    queryFn: () => getClient(supabase, props.clientId),
  });

  if (!data?.status) return null;

  return (
    <Fragment>
      <DisableClientAlert
        clientId={props.clientId}
        open={disableClientOpen}
        closeAlert={() => setDisableClientOpen(false)}
      />
      <Button variant="destructive" className="rounded-full" onClick={() => setDisableClientOpen(true)} size="sm">
        <AiOutlineStop />
        Disable Client
      </Button>
    </Fragment>
  );
}

type DisableClientButtonProps = {
  clientId: string;
};
