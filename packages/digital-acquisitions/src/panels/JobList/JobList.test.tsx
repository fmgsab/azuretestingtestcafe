import React, * as hooks from 'react';

import { act, render, screen, userEvent } from '@fmg/ui/src/test/test-utils';
import * as media from '@fmg/ui/src/hooks/useMediaQuery';
import { JobList } from './JobList';

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as object;
  return { ...actual };
});

describe('<JobList />', () => {
  const data = [
    {
      id: '228e0772-3e10-457c-8588-ad2b58b18b9e',
      accountName: 'Witting Group',
      accountHolder: 'Jeffery Wisozk-Williamson',
      viewed: '2023-08-07T05:30:27.126Z',
      closed: '',
    },
    {
      id: 'dfd73971-5c2a-4080-a369-29a4f1da0c37',
      accountName: 'Feest, Barton and Ward',
      accountHolder: 'Noah Gislason',
      viewed: '2023-08-07T04:42:02.869Z',
      closed: '',
    },
    {
      id: '1bf1b387-3fb4-4eef-b444-57cc64e38bd0',
      accountName: 'Kautzer - Rice',
      accountHolder: 'Saul Glover PhD',
      viewed: '2023-08-07T08:16:18.841Z',
      closed: '2023-08-06T11:41:08.159Z',
    },
    {
      id: '992496f8-36f1-4ff3-849f-da012c58b5c7',
      accountName: "McClure - O'Connell",
      accountHolder: 'Minnie Raynor',
      viewed: '2023-08-06T23:19:23.142Z',
      closed: '',
    },
    {
      id: '020c49fd-08e5-4b33-b49e-cf7d684a9bcc',
      accountName: 'Funk, Kassulke and Rempel',
      accountHolder: 'Mandy Morar',
      viewed: '2023-08-07T04:29:00.951Z',
      closed: '2023-08-06T21:41:55.301Z',
    },
  ];

  const bulkPutFn = vi.fn().mockResolvedValue(Promise.resolve(1));
  const countFn = vi.fn().mockResolvedValue(Promise.resolve(0));
  const toArrayFn = vi.fn().mockResolvedValue(Promise.resolve(data));
  const updateFn = vi.fn().mockResolvedValue(Promise.resolve(1));

  beforeEach(() => {
    vi.spyOn(hooks, 'useRef').mockReturnValueOnce({
      current: { count: countFn, bulkPut: bulkPutFn, toArray: toArrayFn, update: updateFn },
    });
  });

  it.each`
    defaultViewMode | elementName | cnt
    ${'grid'}       | ${'button'} | ${10}
    ${'table'}      | ${'row'}    | ${7}
  `(`should render correctly $defaultViewMode`, async ({ defaultViewMode, elementName, cnt }) => {
    const openJobFn = vi.fn();
    const user = userEvent.setup();
    vi.spyOn(hooks, 'useState').mockReturnValueOnce([data, vi.fn()]);
    vi.spyOn(hooks, 'useState').mockReturnValueOnce([false, vi.fn()]);
    await act(() => render(<JobList openJob={openJobFn} defaultViewMode={defaultViewMode} />));

    const elements = screen.queryAllByRole(elementName);
    expect(elements.length).toEqual(cnt);

    await user.click(elements[4]);
    expect(updateFn).toHaveBeenCalled();
    expect(openJobFn).toHaveBeenCalled();
  });

  it(`should render loading state correctly`, async () => {
    const openJobFn = vi.fn();
    const defaultPageSize = 8;
    vi.spyOn(hooks, 'useState').mockReturnValueOnce([Array.from(Array(defaultPageSize)), vi.fn()]);
    vi.spyOn(hooks, 'useState').mockReturnValueOnce([true, vi.fn()]);
    render(<JobList openJob={openJobFn} delay={300} />);

    const elements = screen.queryAllByTestId('card-loading-skeleton');
    expect(elements.length).toEqual(defaultPageSize);
  });

  it.each`
    isMatchingMedia
    ${true}
    ${false}
  `(`should render columns correctly matching media = $isMatchingMedia`, async ({ isMatchingMedia }) => {
    vi.spyOn(media, 'useMediaQuery').mockReturnValue(isMatchingMedia);
    const openJobFn = vi.fn();
    vi.spyOn(hooks, 'useState').mockReturnValueOnce([false, vi.fn()]);
    render(<JobList openJob={openJobFn} defaultViewMode="table" />);
    const column = screen.queryAllByText('Contact');
    expect(column.length).toEqual(Number(isMatchingMedia));
  });
});
