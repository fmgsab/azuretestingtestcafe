import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';
import { Meta } from '@storybook/react';
import { leads } from 'mock-data';

import { QueryServiceContext } from '@fmg/ui';
import { AppointmentList } from './AppointmentList';

const meta: Meta<typeof AppointmentList> = {
  title: 'diga/Page Panels/Dashboard/Appointments',
  component: AppointmentList,
  parameters: {
    controls: {},
    layout: 'fullscreen',
  },
};

export default meta;

type WrapperProps = {
  delayMs?: number;
  numAppointments?: number;
};

function Wrapper({ delayMs = 0, numAppointments = 31, children }: WrapperProps & PropsWithChildren) {
  const delayRef = useRef(delayMs);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delayRef.current);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryServiceContext.Provider
      value={{
        lookupAddresses: () => Promise.resolve([]),
        getAddressDetail: () => Promise.resolve({}),
        getLeads: () =>
          ({
            isLoading,
            data: leads.slice(0, numAppointments).map(({ postCode, postalZip, ...res }: Record<string, string>) => ({
              ...res,
              postcode: postalZip || postCode,
            })),
          }) as never,
      }}
    >
      <div className="md:mx-15 mb-4.5 mx-12 xl:mx-auto">{children}</div>
    </QueryServiceContext.Provider>
  );
}

export const Default = {
  render: (args: WrapperProps) => (
    <Wrapper {...args}>
      <AppointmentList createJob={() => {}} />
    </Wrapper>
  ),
  args: {
    numAppointments: 31,
  },
  argTypes: {
    numAppointments: {
      control: { type: 'number', min: 0, max: 15 },
    },
  },
};

export const Delayed = {
  ...Default,
  args: {
    ...Default.args,
    delayMs: 3000,
  },
};
