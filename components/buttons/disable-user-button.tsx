'use client';

import { Fragment, useState } from 'react';
import { AiOutlineStop } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import DisableUserAlert from '../alerts/disable-user-alert';
import { type UserMetadata } from '@/helpers/auth-types';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/db/queries/auth';
import { createClient } from '@/utils/supabase/client';

export default function DisableUserButton(props: DisableUserButtonProps) {
  const supabase = createClient();
  const [disableUserOpen, setDisableUserOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['User', props.userId],
    queryFn: () => getUser(supabase, props.userId),
  });

  const userMetaData = data?.user?.user_metadata as UserMetadata;

  if (!userMetaData?.status) return null;

  return (
    <Fragment>
      <DisableUserAlert userId={props.userId} open={disableUserOpen} closeAlert={() => setDisableUserOpen(false)} />
      <Button variant="destructive" className="rounded-full" onClick={() => setDisableUserOpen(true)} size="sm">
        <AiOutlineStop />
        Disable User
      </Button>
    </Fragment>
  );
}

type DisableUserButtonProps = {
  userId: string;
};
