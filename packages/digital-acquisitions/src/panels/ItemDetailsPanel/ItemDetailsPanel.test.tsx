import React, * as hooks from 'react';
import { render, screen, userEvent } from '@fmg/ui/src/test/test-utils';

import * as collections from '@fmg/ui/src/hooks/useDexieTableData';
import * as media from '@fmg/ui/src/hooks/useMediaQuery';

import { ItemDetailsPanel } from './ItemDetailsPanel';
import { MockDB } from '@fmg/ui/src/test/mock-model';

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as object;
  return {
    ...actual,
    useState: vi.fn().mockReturnValue([null, null]),
  };
});

const address1 = '203 Prince Manors Suite 130';
const address2 = '2743 Considine Spring Apt. 823';
const address3 = '822 Roob Lights Suite 468';
const data = [
  {
    name: 'Jaguar Escalade',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '9335' },
    excess: '300',
    location: address1,
  },
  {
    name: 'Tesla LeBaron',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '8866' },
    excess: '300',
    location: address1,
  },
  {
    name: 'Volkswagen Model S',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '2760' },
    excess: '300',
    location: address1,
  },
  {
    name: 'Dodge Model S',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '819' },
    excess: '300',
    location: address3,
  },
  {
    name: 'Hyundai Challenger',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '4201' },
    excess: '300',
    location: address3,
  },
  {
    name: 'Porsche LeBaron',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '5225' },
    excess: '300',
    location: address2,
  },
  {
    name: 'Hyundai Focus',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '2763' },
    excess: '500',
    location: address1,
  },
  {
    name: 'Porsche A8',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '1352' },
    excess: '598',
    location: address2,
  },
  {
    name: 'Ferrari 911',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '265' },
    excess: '500',
    location: address2,
  },
  {
    name: 'Porsche Element',
    coverType: 'Present Day Value',
    sumInsured: { gstExclusive: '2114' },
    excess: '500',
    location: address3,
  },
];

describe('panels/item-summary/Items', () => {
  const db = new MockDB('TestDB', { friends: '++id, name, age, isCloseFriend' });

  beforeAll(() => {
    vi.spyOn(collections, 'useDexieTableData').mockReturnValue({ vehicle: data });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  const props = {
    jobId: 1,
    itemType: '',
    location: '',
    showEmptyTable: false,
    labels: {
      description: 'description',
      coverType: 'Cover Type',
      sumInsured: 'Sum Insured',
      excess: 'Excess',
      action: 'Action',
    },
  };

  const tableList = {
    vehicle: { table: db.friends, heading: 'Vehicles' },
  };

  it('should render table(s)', async () => {
    vi.spyOn(media, 'useMediaQuery').mockReturnValue(true);
    render(<ItemDetailsPanel {...props} jobId={1} tableList={tableList} />);
    const tbl = screen.queryAllByRole('table');
    expect(tbl).toHaveLength(1);
  });

  it.each`
    isMatching | expected
    ${true}    | ${5}
    ${false}   | ${4}
  `('should render $expected columns correctly', async ({ isMatching, expected }) => {
    vi.spyOn(media, 'useMediaQuery').mockReturnValue(isMatching);

    render(<ItemDetailsPanel {...props} jobId={1} tableList={tableList} />);
    const th = screen.queryAllByRole('columnheader');
    expect(th).toHaveLength(expected);
  });

  it.each`
    canEdit  | expected
    ${true}  | ${data.length}
    ${false} | ${0}
  `('should have active $expected buttons', async ({ canEdit, expected }) => {
    vi.spyOn(media, 'useMediaQuery').mockReturnValue(true);

    render(<ItemDetailsPanel {...props} jobId={1} tableList={tableList} canEdit={canEdit} />);
    const edits = screen.queryAllByRole('button');
    expect(edits).toHaveLength(expected);
  });

  it.each`
    itemTypeFilter | length
    ${'content'}   | ${0}
    ${undefined}   | ${1}
  `('should filter correctly when filter=$itemTypeFilter', async ({ itemTypeFilter, length }) => {
    vi.spyOn(media, 'useMediaQuery').mockReturnValue(true);

    const setItemTypeFn = vi.fn();
    vi.spyOn(hooks, 'useState').mockReturnValue([itemTypeFilter, setItemTypeFn]);

    render(<ItemDetailsPanel {...props} jobId={1} tableList={tableList} />);
    const tbl = screen.queryAllByRole('table');
    expect(tbl).toHaveLength(length);
  });

  it('should not render table(s)', async () => {
    vi.spyOn(collections, 'useDexieTableData').mockReturnValue(undefined);

    render(<ItemDetailsPanel {...props} jobId={1} tableList={tableList} />);
    const tbl = screen.queryAllByRole('table');
    expect(tbl).toHaveLength(0);
  });
});
