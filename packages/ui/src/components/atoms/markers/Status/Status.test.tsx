import React from 'react';
import { composeStories, render } from '../../../../test/test-utils';

import * as stories from './Status.stories';

const { NotStarted, Incomplete, Invalid, Complete } = composeStories(stories);

describe('atoms/Count', () => {
  it.each`
    Story
    ${NotStarted}
    ${Incomplete}
    ${Invalid}
    ${Complete}
  `('should render $Story.storyName correctly', async ({ Story }) => {
    const { container } = render(<Story />);
    expect(container.children).toHaveLength(1);
  });
});
