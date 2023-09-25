import React from 'react';
import { composeStories, render, screen, userEvent } from '../../../test/test-utils';

import * as stories from './IconTabs.stories';

const { GridList, ItemTypeLocation } = composeStories(stories);

describe('Components/Segmented Control/Default', () => {
  it('should correctly render Default Icons Segmented Control', async () => {
    const user = userEvent.setup();
    render(<GridList />);

    const gridLabel = screen.getByText('Grid');
    expect(gridLabel).toHaveClass('opacity-1');
    const listText = screen.queryByText('List');
    expect(listText).toHaveClass('opacity-0');

    const buttons = screen.getAllByRole('button');
    const inActive = buttons[1];

    await user.click(inActive);
    expect(gridLabel).toHaveClass('opacity-0');
    expect(listText).toHaveClass('opacity-1');
  });

  it('should correctly render Default Icons Segmented Control', async () => {
    const user = userEvent.setup();
    render(<ItemTypeLocation />);

    const itemLabel = screen.getByText('Item Type');
    expect(itemLabel).toHaveClass('opacity-1');
    const locationText = screen.queryByText('Location');
    expect(locationText).toHaveClass('opacity-0');

    const buttons = screen.getAllByRole('button');
    const inActive = buttons[1];

    await user.click(inActive);
    expect(itemLabel).toHaveClass('opacity-0');
    expect(locationText).toHaveClass('opacity-1');
  });
});
