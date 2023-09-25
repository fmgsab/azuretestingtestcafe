import React from 'react';
import { composeStories, render, screen } from '../../../../test/test-utils';

import * as stories from './DateTime.stories';

const { LongDate, TimeOnly, CustomIcon, CustomFormat } = composeStories(stories);

describe('atoms/DateTime', () => {
  it.each`
    date            | expected
    ${'2023-12-12'} | ${'12 December 2023'}
    ${'2023-05-07'} | ${'7 May 2023'}
    ${'2023-07-07'} | ${'7 July 2023'}
  `('should render $expected correctly', async ({ date, expected }) => {
    render(<LongDate date={date} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it.each`
    date                     | expected
    ${'2023-12-12T15:12:00'} | ${'3:12pm'}
    ${'2023-05-07T02:30:00'} | ${'2:30am'}
    ${'2023-07-07T12:03:00'} | ${'12:03pm'}
  `('should render $expected correctly', async ({ date, expected }) => {
    render(<TimeOnly date={date} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('should return blank for invalid date', async () => {
    const date = '2023-12-12T150000:12:00';
    render(<TimeOnly date={date} />);
    expect(screen.queryByText(date)).not.toBeInTheDocument();
  });

  it.each`
    date                     | expected
    ${'2023-12-12T15:12:00'} | ${'2023-12-12'}
    ${'2023-05-07T02:30:00'} | ${'2023-05-07'}
    ${'2023-07-07T12:03:00'} | ${'2023-07-07'}
  `('should render $expected correctly', async ({ date, expected }) => {
    render(<CustomFormat date={date} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('should render CustomIcon correctly', async () => {
    render(<CustomIcon />);
    expect(screen.queryByTestId('calendar')).toBeInTheDocument();
  });

  it('should not print icon', async () => {
    render(<CustomIcon icon={false} />);
    expect(screen.queryByTestId('calendar')).not.toBeInTheDocument();
  });
});
