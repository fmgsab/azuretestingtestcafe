import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './PageSize.stories';

const { Default } = composeStories(stories);

describe('tables/PageSize', () => {
  it.each`
    label               | expected
    ${'Load more data'} | ${'Load more data'}
    ${''}               | ${'Load More'}
  `('should render button label $label correctly', async ({ label, expected }) => {
    render(<Default label={label} />);
    const button = screen.queryByRole('button');
    expect(button).toHaveAccessibleName(expected);
  });

  it.each`
    size  | expected
    ${8}  | ${'Viewing 8 of 16'}
    ${16} | ${'Viewing 16 of 16'}
    ${20} | ${'Viewing 20 of 20'}
  `('should render total size $expected correctly', async ({ size, expected }) => {
    render(<Default size={size} />);
    const totalSize = screen.queryByText(expected);
    expect(totalSize).toBeInTheDocument();
  });

  it('should disable button', async () => {
    render(<Default size={16} />);
    const button = screen.queryByRole('button');
    expect(button).toBeDisabled();
  });

  it.each`
    size
    ${8}
    ${16}
  `('should disable button', async ({ size }) => {
    render(<Default size={size} isLoading />);
    const button = screen.queryByRole('button');
    expect(button).toBeDisabled();
    const txt = screen.queryByText(`Viewing ${size} of 16`);
    expect(txt).not.toBeInTheDocument();
  });
});
