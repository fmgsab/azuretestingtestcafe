import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';

import * as stories from './Button.stories';

const {
  Primary,
  PrimaryBlock,
  PrimaryDisabled,
  Secondary,
  SecondaryBlock,
  SecondaryDisabled,
  Error,
  ErrorBlock,
  ErrorDisabled,
  PrimaryBlockLight,
  PrimaryBlockLightDisabled,
} = composeStories(stories);

describe('Components/Buttons/Basic Buttons', () => {
  it('should correctly render Primary button', async () => {
    render(<Primary />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  it('should correctly render Primary Block button', async () => {
    render(<PrimaryBlock />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('btn-block');
  });

  it('should correctly render Primary Disabled button', async () => {
    render(<PrimaryDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });

  it('should correctly render Secondary button', async () => {
    render(<Secondary />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-secondary');
  });

  it('should correctly render Secondary Block button', async () => {
    render(<SecondaryBlock />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-secondary');
    expect(button).toHaveClass('btn-block');
  });

  it('should correctly render Secondary Disabled button', async () => {
    render(<SecondaryDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });

  it('should correctly render Error button', async () => {
    render(<Error />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-error');
  });

  it('should correctly render Error Block button', async () => {
    render(<ErrorBlock />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-error');
    expect(button).toHaveClass('btn-block');
  });

  it('should correctly render Error Disabled button', async () => {
    render(<ErrorDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });

  it('should correctly render Primary Block Light button', async () => {
    render(<PrimaryBlockLight />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary-block-light');
  });

  it('should correctly render Primary Block Light Disabled button', async () => {
    render(<PrimaryBlockLightDisabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-disabled');
  });
});
