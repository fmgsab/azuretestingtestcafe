import React, { ReactElement } from 'react';
import IconEmail from '../../../assets/icons/18x18/email.svg';
import IconPhone from '../../../assets/icons/18x18/phone.svg';
import dayjs from 'dayjs';

export type ContactDataProps = {
  data: ContactData[];
};
export type ContactData = {
  accountId: number;
  accountName: string;
  contactSalutation: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  preferredName: string | null;
  dateOfBirth: string | null;
  email: string | null;
  primaryPhone: string | null;
  roleTypes: string[] | null;
};

interface ContactRoleProps {
  role: string;
}

export function getRoles(rolesArray: string[] | null, max: number) {
  return rolesArray?.map((role, index) => (index < max ? <ContactRole key={index} role={role} /> : null));
}

function ContactRole({ role }: ContactRoleProps): ReactElement {
  return (
    <>
      <div className="bg-gray-5 inline-block w-fit items-center justify-center rounded-sm px-3 py-1.5 text-sm/[18px]">{role}</div>
    </>
  );
}
export function ContactCard(data: ContactData): ReactElement {
  const maxRoles = 6;
  return (
    <>
      {/* Main Container */}
      <div className="p-4.5 border-fmg-gray-200 h-fit w-full rounded-t-md border bg-white">
        <div className="gap-x-4.5 grid grid-cols-[48px_minmax(0px,_1fr)] gap-y-1.5">
          {/* Name initials */}
          <div className="bg-primary row-span-2 flex h-12 w-12 items-center justify-center rounded-sm text-xl font-medium text-white">
            {[data.firstName?.charAt(0), data.lastName?.charAt(0)].join('')}
          </div>
          {/* Name */}
          <div className="h-6 truncate text-lg font-medium">
            {[data.contactSalutation, data.firstName, data.middleName, data.lastName].join(' ').replace(/\s{2,}/, ' ')}
          </div>
          {/* DOB */}
          <div className="h-4.5 text-fmg-gray-810 truncate text-base" data-testid="dateOfBirth">
            Born {data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD MMMM YYYY') : ''}
          </div>
        </div>
        <div className="mt-4.5 grid grid-cols-[18px_minmax(0px,_1fr)] gap-x-3 gap-y-1.5">
          {/* Email */}
          <IconEmail className="fill-fmg-gray-480" />
          <div className="truncate text-base">{data.email}</div>
          {/* Phone */}
          <IconPhone className="fill-fmg-gray-480" />
          <div className="truncate text-base">{data.primaryPhone}</div>
        </div>
      </div>
      {/* Roles Container */}
      <div className="bg-fmg-gray-50 border-fmg-gray-200 p-4.5 inline-flex w-full flex-wrap gap-1.5 rounded-b-md border-x border-b">
        {getRoles(data?.roleTypes, maxRoles)}
      </div>
    </>
  );
}
