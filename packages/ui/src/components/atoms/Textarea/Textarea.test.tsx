import React from 'react';
import * as stories from './Textarea.stories';
import { composeStories, render, renderHook, screen, userEvent } from '../../../test/test-utils';
import { Mock } from 'vitest';
import { useAutosizeTextArea } from "./Textarea";

const { Default, FixedSized } = composeStories(stories);

describe('atoms/Textarea', () => {
  let scrollIntoViewMock: Mock;
  let scrollByMock: Mock;

  beforeEach(() => {
    scrollIntoViewMock = vi.fn();
    scrollByMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    Object.defineProperty(window, 'scrollBy', { value: scrollByMock });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'scrollBy', {
      value: undefined,
    });
  });

  it('should render hook correctly', async () => {
    const { result } = renderHook(useAutosizeTextArea);
    const { ref } = result.current;

    expect(ref.current).not.toBeNull();
  });

  it('should render correctly for autosized', async () => {
    const user = userEvent.setup();

    render(<Default />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'a{enter}b{enter}c{enter}');
    expect(input).toHaveValue('a\nb\nc\n');
    expect(input.style.height).toContain(input.scrollHeight);
  });

  it('should render correctly for fixed', async () => {
    const user = userEvent.setup();

    render(<FixedSized />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'a{enter}b{enter}c{enter}');
    expect(input).toHaveValue('a\nb\nc\n');
    expect(input.style.height).toBeFalsy();
  });
});
