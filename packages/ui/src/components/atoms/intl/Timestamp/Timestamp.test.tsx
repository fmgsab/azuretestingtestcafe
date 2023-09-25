import React from 'react';
import { composeStories, render, screen } from '../../../../test/test-utils';

import * as stories from './Timestamp.stories';

const { Default, Verbose, LastOpened } = composeStories(stories);

describe('atoms/Timestamp', () => {
  const mockedDate = '2023-05-29T00:00:00Z';
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockedDate));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it.each`
    date                     | expected
    ${'2023-12-12'}          | ${'12 December 2023'}
    ${'2023-05-07'}          | ${'7 May 2023'}
    ${'2023-05-29T13:24:00'} | ${'Today at 1:24pm'}
  `('should render $date correctly', async ({ date, expected }) => {
    render(<Default date={date} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each`
    date                     | expected
    ${'2023-12-12T15:12:00'} | ${'12 December 2023 at 3:12pm'}
    ${'2023-05-07T02:30:00'} | ${'7 May 2023 at 2:30am'}
    ${'2023-05-29T13:24:00'} | ${'29 May 2023 at 1:24pm'}
  `('should render $date correctly', async ({ date, expected }) => {
    render(<Verbose date={date} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each`
    date                     | expected
    ${'2023-12-12T15:12:00'} | ${'Last opened 12 December 2023'}
    ${'2023-05-07T02:30:00'} | ${'Last opened 7 May 2023'}
    ${'2023-05-29T13:24:00'} | ${'Last opened today at 1:24pm'}
  `('should render $date correctly', async ({ date, expected }) => {
    render(<LastOpened date={date} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
