import React from 'react';
import { composeStories, render } from '../../../../test/test-utils';

import * as stories from './Count.stories';

const { None, OneDigit, TwoDigits } = composeStories(stories);

describe('atoms/Count', () => {
  it.each`
    Story        | expected
    ${None}      | ${0}
    ${OneDigit}  | ${1}
    ${TwoDigits} | ${1}
  `('should render $Story.storyName correctly', async ({ Story, expected }) => {
    const { container } = render(<Story />);
    expect(container.children).toHaveLength(expected);
  });
});
