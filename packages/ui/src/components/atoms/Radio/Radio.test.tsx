import React from 'react';
import { composeStories, render, screen, userEvent } from '../../../test/test-utils';

import * as stories from './Radio.stories';

const { Untoggled, Toggled, Disabled, Invalid } = composeStories(stories);

describe('atoms/Radio', () => {
  it('should render Default correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(<Untoggled />);
    const [label] = container.children;
    const [checkContainer] = label.children;
    expect(checkContainer).toBeInTheDocument();

    const input = screen.getByRole('radio');
    expect(input).toBeEnabled();

    await user.click(input);
    expect(input).toBeChecked();
  });

  it('should function correctly with keyboard events', async () => {
    const user = userEvent.setup();
    const { container } = render(<Untoggled />);

    const input = screen.getByRole('radio');

    await user.click(container);
    await user.tab();
    expect(input).toHaveFocus();

    await user.type(input, '{space}');
    expect(input).toBeChecked();
  });

  it('should render Checked correctly', async () => {
    render(<Toggled />);

    const input = screen.getByRole('radio');

    const div1 = input.nextSibling;
    expect(div1).toHaveClass('peer-focus-visible:bg-fmg-green-20');
    const div2 = div1?.nextSibling;
    expect(div2).toHaveClass('peer-checked:bg-fmg-green');
    const div3 = div2?.nextSibling;
    expect(div3).toHaveClass('peer-checked:bg-white');
  });

  it('should render Invalid correctly', async () => {
    render(<Invalid />);

    const input = screen.getByRole('radio');

    const div1 = input.nextSibling;
    const div2 = div1?.nextSibling;
    expect(div2).toHaveClass('peer-checked:bg-error');
    const div3 = div2?.nextSibling;
    expect(div3).toHaveClass('peer-checked:bg-white');
  });

  it('should render Disabled correctly', async () => {
    const user = userEvent.setup();
    const { container } = render(<Disabled />);

    const input = screen.getByRole('radio');
    expect(input).toBeDisabled();

    await user.click(input);
    expect(input).not.toBeChecked();

    await user.click(container);
    await user.tab();
    expect(input).not.toHaveFocus();
    expect(input.parentNode).toHaveClass('!cursor-not-allowed');
    expect(input.nextSibling).toHaveClass('transition-none group-hover:!bg-transparent');

    await user.type(input, '{space}');
    expect(input).not.toBeChecked();
  });
});
