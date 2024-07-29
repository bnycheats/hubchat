'use client';

import { Fragment, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { format } from 'date-fns';
import { AiOutlineRight } from 'react-icons/ai';

import Avatar from '@/components/header/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type UserMetadata } from '@/utils/supabase/client/auth/types';
import UpdateFullNameModal from './update-full-name-modal';
import UpdateDobModal from './update-dob-modal';
import UpdatePhoneModal from './update-phone-modal';
import UpdateAddressModal from './update-address-modal';

export default function ProfilePage() {
  const { session } = useAuth();

  const userMetaData = session?.user.user_metadata as UserMetadata;

  const [updateFullNameOpen, setUpdateFullNameOpen] = useState(false);
  const [updateDateOfBirthOpen, setUpdateDateOfBirthOpen] = useState(false);
  const [updatePhoneOpen, setUpdatePhoneOpen] = useState(false);
  const [updateAddressOpen, setUpdateAddressOpen] = useState(false);
  return (
    <section>
      {userMetaData && (
        <Fragment>
          <UpdateFullNameModal open={updateFullNameOpen} closeModal={() => setUpdateFullNameOpen(false)} />
          <UpdateDobModal open={updateDateOfBirthOpen} closeModal={() => setUpdateDateOfBirthOpen(false)} />
          <UpdatePhoneModal open={updatePhoneOpen} closeModal={() => setUpdatePhoneOpen(false)} />
          <UpdateAddressModal open={updateAddressOpen} closeModal={() => setUpdateAddressOpen(false)} />
        </Fragment>
      )}
      <div className="flex flex-col">
        {session && (
          <Fragment>
            <div className="flex items-center flex-wrap gap-4 pb-6">
              <Avatar className="h-12 w-12" textClassName="text-2xl" name={session.user.email} />
              <span>{session.user.email}</span>
              <div className="flex gap-1 flex-wrap">
                {userMetaData?.user_role?.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-100 py-4">
              <div>Email address</div>
              <div className="flex flex-col items-start gap-2">{session.user.email}</div>
            </div>
          </Fragment>
        )}
        {userMetaData && (
          <Fragment>
            <div className="grid grid-cols-3 border-t border-slate-100 py-6">
              <div>Full name</div>
              <div className="flex flex-col items-start gap-2">
                {`${userMetaData.first_name} ${userMetaData.last_name}`}
                <Button onClick={() => setUpdateFullNameOpen(true)} variant="link" className="flex h-auto gap-1 p-0">
                  Edit
                  <AiOutlineRight />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-100 py-6">
              <div>Date of birth</div>
              <div className="flex flex-col items-start gap-2">
                {!!userMetaData.dob && format(new Date(Number(userMetaData.dob)), 'LL/dd/yyyy')}
                <Button onClick={() => setUpdateDateOfBirthOpen(true)} variant="link" className="flex h-auto gap-1 p-0">
                  Edit
                  <AiOutlineRight />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-100 py-6">
              <div>Phone number</div>
              <div className="flex flex-col items-start gap-2">
                {userMetaData?.phone_number}
                <Button onClick={() => setUpdatePhoneOpen(true)} variant="link" className="flex h-auto gap-1 p-0">
                  Edit
                  <AiOutlineRight />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-slate-100 py-6">
              <div>Address</div>
              <div className="flex flex-col items-start gap-2">
                {userMetaData?.postal_code && <div>{userMetaData.postal_code}</div>}
                {userMetaData?.street && <div>{userMetaData.street}</div>}
                {userMetaData?.province && <div>{userMetaData.province}</div>}
                <Button onClick={() => setUpdateAddressOpen(true)} variant="link" className="flex h-auto gap-1 p-0">
                  Edit
                  <AiOutlineRight />
                </Button>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </section>
  );
}
