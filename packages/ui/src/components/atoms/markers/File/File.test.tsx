import React from 'react';
import { composeStories, render, screen } from '../../../../test/test-utils';

import * as stories from './File.stories';

const { Small, Default } = composeStories(stories);

describe('atoms/File', () => {
  it.each`
    Story
    ${Default}
    ${Small}
  `('should render $Story.storyName correctly', async ({ Story }) => {
    const { container } = render(<Story />);
    expect(screen.queryByTestId('file-icon')).toBeInTheDocument();
  });
});
