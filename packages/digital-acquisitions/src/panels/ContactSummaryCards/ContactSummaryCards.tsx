import React, { ReactElement } from 'react';
import { ContactCard, ContactDataProps } from '@fmg/ui';

export function ContactSummaryCards({ data }: ContactDataProps): ReactElement {
  return (
    <>
      <ul className="gap-4.5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,max(350px,100%/4)),1fr))]">
        {data.map((contact, index) => (
          <li key={index}>
            <ContactCard
              key={contact.email}
              accountId={contact.accountId}
              accountName={contact.accountName}
              contactSalutation={contact.contactSalutation}
              firstName={contact.firstName}
              middleName={contact.middleName}
              lastName={contact.lastName}
              preferredName={contact.preferredName}
              dateOfBirth={contact.dateOfBirth}
              email={contact.email}
              primaryPhone={contact.primaryPhone}
              roleTypes={contact.roleTypes}
            ></ContactCard>
          </li>
        ))}
      </ul>
    </>
  );
}
