import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './Tabs.stories';

const { Default } = composeStories(stories);

describe('Components/Segmented Control/Default', () => {
  it('should correctly render Default Segmented Control', async () => {
    render(<Default />);

    const accountButton = screen.getByText('Account');
    expect(accountButton).toBeInTheDocument();
    const itemsButton = screen.getByText('Items');
    expect(itemsButton).toBeInTheDocument();
    const declarationsButton = screen.getByText('Declarations');
    expect(declarationsButton).toBeInTheDocument();
  });
});
