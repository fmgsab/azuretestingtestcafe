import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './WorkItem.stories';

const { InProgress, Loading } = composeStories(stories);

describe('cards/WorkItem', () => {
  it('should render correctly', async () => {
    render(<InProgress />);
    expect(screen.getByText('Kent Bailey')).toBeInTheDocument();
    expect(screen.getByText('Last opened 12 December 2022')).toBeInTheDocument();
  });

  it('should render Loading correctly', async () => {
    render(<Loading />);
    expect(screen.queryByText('Kent Bailey')).not.toBeInTheDocument();
    expect(screen.queryByText('Last opened 12 December 2022')).not.toBeInTheDocument();
  });
});
