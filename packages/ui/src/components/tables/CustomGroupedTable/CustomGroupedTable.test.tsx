import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './CustomGroupedTable.stories';

const { Default } = composeStories(stories);

const address1 = '203 Prince Manors Suite 130';
const address2 = '2743 Considine Spring Apt. 823';
const address3 = '822 Roob Lights Suite 468';
const props = {
  data: [
    {
      description: 'Jaguar Escalade',
      coverType: 'Present Day Value',
      sumInsured: '9335',
      excess: '300',
      address: address1,
    },
    {
      description: 'Tesla LeBaron',
      coverType: 'Present Day Value',
      sumInsured: '8866',
      excess: '300',
      address: address1,
    },
    {
      description: 'Volkswagen Model S',
      coverType: 'Present Day Value',
      sumInsured: '2760',
      excess: '300',
      address: address1,
    },
    {
      description: 'Dodge Model S',
      coverType: 'Present Day Value',
      sumInsured: '819',
      excess: '300',
      address: address3,
    },
    {
      description: 'Hyundai Challenger',
      coverType: 'Present Day Value',
      sumInsured: '4201',
      excess: '300',
      address: address3,
    },
    {
      description: 'Porsche LeBaron',
      coverType: 'Present Day Value',
      sumInsured: '5225',
      excess: '300',
      address: address2,
    },
    {
      description: 'Hyundai Focus',
      coverType: 'Present Day Value',
      sumInsured: '2763',
      excess: '500',
      address: address1,
    },
    {
      description: 'Porsche A8',
      coverType: 'Present Day Value',
      sumInsured: '1352',
      excess: '598',
      address: address2,
    },
    {
      description: 'Ferrari 911',
      coverType: 'Present Day Value',
      sumInsured: '265',
      excess: '500',
      address: address2,
    },
    {
      description: 'Porsche Element',
      coverType: 'Present Day Value',
      sumInsured: '2114',
      excess: '500',
      address: address3,
    },
  ],
  groupBy: 'address',
};

describe('tables/CustomGroupedTable', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  it.each`
    heading       | expected
    ${'Vehicles'} | ${1}
    ${null}       | ${0}
  `('should render heading=$expected', async ({ heading, expected }) => {
    render(<Default {...props} heading={heading} />);
    const element = screen.queryAllByRole('heading');
    expect(element).toHaveLength(expected);
  });

  it('should render groups correctly', async () => {
    render(<Default {...props} />);
    const group1 = screen.queryAllByText(address1);
    expect(group1).toHaveLength(1);
    const group2 = screen.queryAllByText(address2);
    expect(group2).toHaveLength(1);
    const group3 = screen.queryAllByText(address3);
    expect(group3).toHaveLength(1);
  });

  it('should not render groups', async () => {
    render(<Default {...props} groupBy={undefined} />);
    const group1 = screen.queryAllByText(address1);
    expect(group1).toHaveLength(4);
    const group2 = screen.queryAllByText(address2);
    expect(group2).toHaveLength(3);
    const group3 = screen.queryAllByText(address3);
    expect(group3).toHaveLength(3);
  });

  it.each`
    groupBy      | expected
    ${undefined} | ${4}
    ${'address'} | ${1}
  `('should only render address $expected times according to groupBy=$groupBy', async ({ groupBy, expected }) => {
    render(<Default {...props} groupBy={groupBy} address={address1} />);
    const group1 = screen.queryAllByText(address1);
    expect(group1).toHaveLength(expected);
    const group2 = screen.queryAllByText(address2);
    expect(group2).toHaveLength(0);
    const group3 = screen.queryAllByText(address3);
    expect(group3).toHaveLength(0);
  });

  it.each`
    address      | expected
    ${undefined} | ${1}
    ${address1}  | ${0}
  `('should render according to filter=$address', async ({ address, expected }) => {
    const data = [
      {
        accountId: 20075385,
        accountName: 'Lowery Farms Limited',
        policyLine: 'Liability',
        policyStatus: 'Renewing',
        heading: 'Liability',
        itemSubtype: 'Liability',
        description: 'Liability',
        coverType: 'Base',
        sumInsured: 2000000,
        excess: 250,
      },
    ];
    render(<Default data={data} address={address} />);
    const table = screen.queryAllByRole('table');
    expect(table).toHaveLength(expected);
  });
});
