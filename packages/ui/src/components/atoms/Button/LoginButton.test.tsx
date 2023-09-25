import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';
import * as stories from './LoginButton.stories';

const { Default, Disabled, Placeholder } = composeStories(stories);

describe('Components/Buttons/Login Buttons', () => {
  it('should correctly render Login button', async () => {
    render(<Default />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary-inline-light');
    expect(button).toHaveClass('btn-square');

    const img = screen.queryByRole('img');
    expect(img).toBeInTheDocument();
    expect(button).toContainElement(img);

    const svg = screen.queryByLabelText('svg-icon');
    expect(svg).not.toBeInTheDocument();
  });

  it('should correctly render Login Disabled button', async () => {
    render(<Disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-square');
    expect(button).toHaveClass('btn-disabled');

    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  it('should correctly render Login button when no imageUrl is present', async () => {
    render(<Placeholder />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-square');

    const svg = screen.queryByLabelText('svg-icon');
    expect(svg).toBeInTheDocument();
    expect(button).toContainElement(svg);
  });
});
