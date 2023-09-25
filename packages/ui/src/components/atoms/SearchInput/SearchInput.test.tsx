import React from 'react';
import { render, screen, userEvent } from '../../../test/test-utils';

import { SearchInput } from './SearchInput';

describe('atoms/SearchInput', () => {
  it('should set value correctly', async () => {
    vi.useFakeTimers();
    const setValueFn = vi.fn();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<SearchInput setValue={setValueFn} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test');
    vi.advanceTimersByTime(300);
    expect(setValueFn).toHaveBeenCalled();
    expect(input).toHaveValue('test');

    const clearButton = screen.getByRole('button');
    await user.click(clearButton);
    expect(setValueFn).toHaveBeenCalled();
    expect(input).toHaveValue('');
  });
});
