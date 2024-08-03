'use client';

import { Fragment, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import UpdateUserRolesModal from '../modals/update-user-roles-modal';
import { type UserMetadata } from '@/helpers/auth-types';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/db/client/queries/auth';

export default function UpdateRolesButton(props: UpdateRolesButtonProps) {
  const [updateUserRolesOpen, setUpdateUserRolesOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['User', props.userId],
    queryFn: () => getUser(props.userId),
  });

  const userMetaData = data?.user?.user_metadata as UserMetadata;

  if (!userMetaData?.user_role) return null;

  return (
    <Fragment>
      <UpdateUserRolesModal
        userId={props.userId}
        userRoles={userMetaData.user_role}
        open={updateUserRolesOpen}
        closeModal={() => setUpdateUserRolesOpen(false)}
      />
      <Button className="rounded-full" onClick={() => setUpdateUserRolesOpen(true)} size="sm">
        <AiOutlineEdit />
        Update roles
      </Button>
    </Fragment>
  );
}

type UpdateRolesButtonProps = {
  userId: string;
};
