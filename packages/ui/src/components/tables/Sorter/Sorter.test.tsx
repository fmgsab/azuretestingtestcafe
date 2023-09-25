import React from 'react';
import { composeStories, render, screen, userEvent } from '../../../test/test-utils';

import * as stories from './Sorter.stories';

const { DefaultOption, NoDefaultOption } = composeStories(stories);

describe('tables/Sorter', () => {
  it('should render Default correctly', async () => {
    const { container } = render(<DefaultOption />);
    const valueContainer = container.querySelector('div[class$=ValueContainer]');
    expect(valueContainer).toBeInTheDocument();
  });

  it('should render menu correctly', async () => {
    const setSortingFn = vi.fn();
    const user = userEvent.setup();
    const { container } = render(<DefaultOption menuIsOpen setSorting={setSortingFn} />);
    const valueContainer = container.querySelector('div[class$=ValueContainer]');
    expect(valueContainer).toBeDefined();

    const menu = container.querySelector('div[class$=menu]');
    expect(menu).toBeInTheDocument();
    const account = screen.getByText('Account');
    expect(account).toBeInTheDocument();

    await user.click(account);
    expect(setSortingFn).toHaveBeenCalledWith([{ id: 'name', desc: false }]);
  });

  it('should render correctly when no options ', async () => {
    render(<NoDefaultOption menuIsOpen columnDefinitions={[]} />);

    const noOptionMessage = screen.getByText('No options');
    expect(noOptionMessage).toHaveClass('!text-start');
  });
});
