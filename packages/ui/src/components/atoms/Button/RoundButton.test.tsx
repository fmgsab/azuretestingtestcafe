import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './RoundButton.stories';

const { Default, Disabled } = composeStories(stories);

describe('Components/Buttons/Round Buttons', () => {
  it('should correctly render Round button', async () => {
    render(<Default />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary-light');
    expect(button).toHaveClass('btn-circle');
  });

  it('should correctly render Round Disabled button', async () => {
    render(<Disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-circle');
    expect(button).toHaveClass('btn-disabled');
  });

  it('should correctly pass a className', async () => {
    render(<Default className="abc" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('abc');
  });
});
