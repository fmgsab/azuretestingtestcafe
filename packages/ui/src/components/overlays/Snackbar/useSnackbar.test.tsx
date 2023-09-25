import React from 'react';
import { act, composeStories, render, screen, fireEvent, renderHook } from '../../../test/test-utils';
import * as stories from './useSnackbar.stories';
import * as snackbarHook from './useSnackbar';

const { Warning } = composeStories(stories);

describe('overlays/Snackbar', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });
  afterAll(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
      };
    };

  it('should Warning render and dismiss via button click correctly', async () => {
    render(<Warning />);
    const openButton = screen.getByRole('button');
    fireEvent.click(openButton);
    const snackbarRoot = screen.getByText('Warning')?.parentElement?.parentElement;
    expect(snackbarRoot).toHaveClass('bg-warning');
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    await act(() => {
      vi.advanceTimersByTime(1000);
    });
    const text = screen.queryByText('Warning');
    expect(text).toBeNull();
  });

  it('should render Container correctly', async () => {

    const { container } = render(<snackbarHook.Container />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          style="position: fixed; z-index: 9999; top: 0px; left: 0px; right: 0px; bottom: 60px; pointer-events: none;"
        />
      </div>
    `);
  });

  it('should render hook correctly', async () => {
    const { result } = renderHook(() => snackbarHook.useSnackbar('success', 'Custom label'));
    expect(result.current).toEqual({
      open: expect.any(Function),
      Container: expect.any(Function),
    });
  });

  it('should invoke hook correctly', async () => {
    const openFn = vi.fn();
    const ContainerMock = vi.fn(() => <div></div>);

    const spy = vi.spyOn(snackbarHook, 'useSnackbar');
    spy.mockReturnValue({ open: openFn, Container: ContainerMock });

    render(<Warning />);

    expect(spy).toHaveBeenCalled();

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(openFn).toHaveBeenCalled();
    expect(ContainerMock).toHaveBeenCalled();
  });
});
