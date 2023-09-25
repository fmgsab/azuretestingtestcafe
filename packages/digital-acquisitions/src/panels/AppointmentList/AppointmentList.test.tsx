import React from 'react';

import { render, screen, userEvent } from '@fmg/ui/src/test/test-utils';
import * as media from '@fmg/ui/src/hooks/useMediaQuery';
import * as qryCtxUtil from '@fmg/ui/src/context/QueryServiceContext';
import { AppointmentList } from './AppointmentList';

describe('<AppointmentList />', () => {
  const data = [
    {
      leadId: 'c1649da0-6ac6-4399-a115-d440a8785d02',
      leadStatus: 'Appointment Made',
      opUnitCode: 'BL',
      allocatedTo: 'Elvira Medhurst',
      appointmentStart: '2023-10-04T06:32:06.660Z',
      title: 'Miss',
      firstName: 'Anabelle',
      middleName: 'Ivy',
      lastName: 'Ryan',
      preferredName: 'Bella',
      dateOfBirth: '2003-12-20T05:32:14.667Z',
      phoneType: 'Home',
      phoneNumber: '00 8027 9293',
      emailAddress: 'Ruby60@yahoo.com',
      addressName: null,
      addressCO: null,
      addressLine1: '2321 Eliza Parkway',
      addressLine2: 'Suite 201',
      addressLine3: null,
      city: 'Hansenbury',
      postcode: '2479',
    },
    {
      leadId: 'c23a7810-659e-4d89-8014-cbc7e1a06310',
      leadStatus: 'Appointment Made',
      opUnitCode: 'SH',
      allocatedTo: 'Thelma Huels',
      appointmentStart: '2024-04-26T17:40:41.092Z',
      title: 'Mr.',
      firstName: 'Watson',
      middleName: 'Harry',
      lastName: 'Zulauf',
      preferredName: null,
      dateOfBirth: '1978-09-08T15:00:14.180Z',
      phoneType: 'Home',
      phoneNumber: '+61 420 543 765',
      emailAddress: 'Scarlett.Mueller@gmail.com',
      addressName: null,
      addressCO: null,
      addressLine1: '633 Young Meadow',
      addressLine2: 'Apt. 208',
      addressLine3: null,
      city: 'Laurencester',
      postcode: '4646',
    },
  ];

  beforeEach(() => {
    const getLeads = vi.fn().mockReturnValue({ data, isLoading: false, isSuccess: true });
    // eslint-disable-next-line
    // @ts-ignore
    vi.spyOn(qryCtxUtil, 'useQueryServiceContext').mockReturnValue({ getLeads });
  });

  it.each`
    defaultViewMode | elementName
    ${'grid'}       | ${'button'}
    ${'table'}      | ${'row'}
  `(`should render correctly $defaultViewMode`, async ({ defaultViewMode, elementName }) => {
    const user = userEvent.setup();

    const createJobFn = vi.fn();
    render(<AppointmentList defaultViewMode={defaultViewMode} createJob={createJobFn} />);
    const elements = screen.queryAllByRole(elementName);
    expect(elements.length).toBeGreaterThanOrEqual(data.length);
    expect(screen.getAllByText('Bella Ryan')); // print preferred name if existing

    await user.click(screen.queryAllByText('+ New Application')[0]);
    expect(createJobFn).toHaveBeenCalled();
  });

  it(`should render loading state correctly`, async () => {
    const getLeads = vi.fn().mockReturnValue({ data: undefined, isLoading: true, isSuccess: undefined });
    // eslint-disable-next-line
    // @ts-ignore
    vi.spyOn(qryCtxUtil, 'useQueryServiceContext').mockReturnValue({ getLeads });

    const defaultPageSize = 8;
    render(<AppointmentList createJob={vi.fn()} />);

    const elements = screen.queryAllByTestId('card-loading-skeleton');
    expect(elements.length).toEqual(defaultPageSize);
  });

  it(`should render failure state correctly`, async () => {
    const getLeads = vi.fn().mockReturnValue({ data: undefined, isLoading: false, isSuccess: false });
    // eslint-disable-next-line
    // @ts-ignore
    vi.spyOn(qryCtxUtil, 'useQueryServiceContext').mockReturnValue({ getLeads });

    render(<AppointmentList createJob={vi.fn()} />);

    const elements = screen.queryAllByTestId('card-loading-skeleton');
    expect(elements.length).toEqual(0);
  });

  it.each`
    isMatchingMedia
    ${true}
    ${false}
  `(`should render columns correctly matching media = $isMatchingMedia`, async ({ isMatchingMedia }) => {
    vi.spyOn(media, 'useMediaQuery').mockReturnValue(isMatchingMedia);
    render(<AppointmentList defaultViewMode="table" createJob={vi.fn()} />);
    const columns = screen.queryAllByRole('columnheader');
    expect(columns.length).toEqual(Number(isMatchingMedia) + 3);
  });
});
