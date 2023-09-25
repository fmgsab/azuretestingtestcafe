import React from 'react';
import { render, screen, act, userEvent } from '../../../test/test-utils';

import Button from './ApplicationSummaryButton';

describe('Components/Buttons/Basic Buttons', () => {
  const handler = vi.fn();
  it('should correctly render Default Application Summary button', async () => {
    const user = userEvent.setup();
    render(
      <Button aria-label="Application Summary Button" isActive={false} onClick={handler}>
        Application Summary
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('hover:');
    expect(button.className).toContain('active:');

    await act(() => user.click(button));

    expect(handler).toHaveBeenCalled();
  });

  it('should correctly render Active Application Summary button', async () => {
    render(
      <Button aria-label="Application Summary Button" isActive={true}>
        Application Summary
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-240-active');
  });
});