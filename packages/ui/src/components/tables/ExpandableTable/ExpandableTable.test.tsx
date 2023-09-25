import React, * as hooks from 'react';
import { composeStories, render, screen, userEvent } from '../../../test/test-utils';

import * as stories from './ExpandableTable.stories';

const { Default, WorkItemListTop8, WorkItemTop8 } = composeStories(stories);

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as object;
  return { ...actual };
});

describe('tables/ExpandableTable', () => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  afterAll(() => {
    vi.clearAllMocks();
  });

  it.each`
    heading                     | expected
    ${'Appointment Made Leads'} | ${1}
    ${null}                     | ${0}
  `('should render heading=$expected', async ({ heading, expected }) => {
    render(<Default heading={heading} />);
    const element = screen.queryAllByRole('heading');
    expect(element).toHaveLength(expected);
  });

  it('should render NoData correctly', async () => {
    const NoData = <>No Data</>;
    render(<Default NoData={NoData} data={[]} />);
    expect(screen.queryByText('No Data')).toBeInTheDocument();
  });

  it.each`
    mode       | expected
    ${'grid'}  | ${0}
    ${'table'} | ${1}
  `('should render correctly when mode=$mode', async ({ mode, expected }) => {
    render(<Default defaultViewMode={mode} />);
    const table = screen.queryAllByRole('table');
    expect(table).toHaveLength(expected);
  });

  it('should enable filter', async () => {
    render(<Default canFilter />);
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();
  });

  it('should render No results', async () => {
    // global filter
    vi.spyOn(hooks, 'useState').mockReturnValueOnce(['filter value', vi.fn()]);
    vi.spyOn(hooks, 'useState').mockReturnValueOnce(['table', vi.fn()]);
    vi.spyOn(hooks, 'useState').mockReturnValueOnce(['grid', vi.fn()]);
    render(<Default canFilter />);
    expect(screen.queryByText(/No results for/i)).toBeInTheDocument();
  });

  it('should enable sorter', async () => {
    render(<Default canChangeSorting />);
    const sorter = screen.getByRole('combobox');
    expect(sorter).toBeInTheDocument();
  });

  it('should enable mode switcher', async () => {
    const user = userEvent.setup();
    render(<Default canSwitchViewMode />);

    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(3);

    await user.click(buttons[1]);

    const table = screen.queryByRole('table');
    expect(table).toBeInTheDocument();

    await user.click(buttons[0]);

    expect(table).not.toBeInTheDocument();
  });

  it.each`
    Story               | elementName
    ${WorkItemTop8}     | ${'button'}
    ${WorkItemListTop8} | ${'row'}
  `('should invoke onRowSelection correctly for $Story.storyName', async ({ Story, elementName }) => {
    const onRowSelectionFn = vi.fn();
    const user = userEvent.setup();
    render(<Story canSwitchViewMode onRowSelection={onRowSelectionFn} />);
    const elements = screen.queryAllByRole(elementName);
    expect(elements.length).toBeGreaterThanOrEqual(8);

    await user.click(elements[8]);
    expect(onRowSelectionFn).toHaveBeenCalledTimes(1);
  });

  it('should set page size correctly', async () => {
    const user = userEvent.setup();
    render(<Default defaultPageSize={8} />);

    const button = screen.queryAllByRole('button', { name: 'Load More' });
    expect(button).toHaveLength(1);

    await user.click(button[0]);

    expect(screen.queryAllByTestId('card')).toHaveLength(16);
  });
});
