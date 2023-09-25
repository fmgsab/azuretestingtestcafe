import React from 'react';
import { render, composeStories, screen } from '../../../test/test-utils';

import * as stories from './InlineButton.stories';

const { Light, LightDisabled, Secondary, SecondarySquare, SecondaryDisabled } = composeStories(stories);

describe('Components/Buttons/Inline Buttons', () => {
  it('should correctly render Light button', async () => {
    render(<Light />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-ghost');
  });

  it('should correctly render Light Disabled button', async () => {
    render(<LightDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });

  it('should correctly render Secondary button', async () => {
    render(<Secondary />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary-inline-light');
  });

  it('should correctly render Secondary Square button', async () => {
    render(<SecondarySquare />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary-inline-light');
    expect(button).toHaveClass('btn-square');
  });

  it('should correctly render Secondary Disabled button', async () => {
    render(<SecondaryDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });
});
