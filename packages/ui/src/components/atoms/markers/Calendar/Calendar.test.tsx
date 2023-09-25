import React from 'react';
import { composeStories, render, screen } from '../../../../test/test-utils';

import * as stories from './Calendar.stories';

const { Default } = composeStories(stories);

describe('atoms/Calendar', () => {
  it.each`
    date            | expected
    ${'2022-12-12'} | ${['12', 'DEC']}
    ${'2022-05-07'} | ${['7', 'MAY']}
    ${'2022-07-07'} | ${['7', 'JUL']}
  `('should render $date correctly', async ({ date, expected }) => {
    render(<Default date={date} />);
    expect(screen.getByText(expected[0])).toBeInTheDocument();
    expect(screen.getByText(expected[1])).toBeInTheDocument();
  });

  it('should return blank for invalid date', async () => {
    const date = '2023-12-12T150000:12:00';
    render(<Default date={date} />);
    expect(screen.queryByText(date)).not.toBeInTheDocument();
  });
});
