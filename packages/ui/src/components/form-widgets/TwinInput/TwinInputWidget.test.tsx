import { act, composeStories, render, screen, userEvent, withFormWrapper } from '../../../test/test-utils';
import * as stories from '../SumInsured/SumInsuredWidget.stories';
import * as scope from '../../../hooks/useScope';
import * as saveField from '../../../hooks/useSaveField';
import * as formField from '../../../hooks/useFormFieldGroup';
import { truthyOrString } from './TwinInputWidget';

const { Default } = composeStories(stories);

describe('form-widgets/Sum Insured', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show a prefix', async () => {
    await act(() => render(<Default />));
    expect(screen.getAllByText('$').length).toBe(2);
  });

  describe('call saveField', () => {
    const saveFieldFn = vi.fn();
    const saveFieldSpy = vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    it('should should handle set incl value correctly', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      await act(() => render(<Default />, { wrapper: withFormWrapper({ defaultValues: {} }) }));

      const excInput = screen.getByPlaceholderText(/gst exclusive/i);
      const incInput = screen.getByPlaceholderText(/gst inclusive/i);

      expect(excInput).toBeInTheDocument();
      expect(incInput).toBeInTheDocument();
      expect(saveFieldSpy).toHaveBeenCalled();

      await user.click(excInput);
      await user.keyboard('100');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(excInput).toHaveDisplayValue('100');
      expect(saveFieldFn).toHaveBeenCalledWith(
        {
          name: expect.any(String),
          value: 100,
        },
        true
      );
      expect(saveFieldFn).toHaveBeenCalledWith(
        {
          name: expect.any(String),
          value: 115,
        },
        true
      );
    });

    it('should should handle excl value correctly', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      await act(() => render(<Default />, { wrapper: withFormWrapper({ defaultValues: {} }) }));

      const excInput = screen.getByPlaceholderText(/gst exclusive/i);
      const incInput = screen.getByPlaceholderText(/gst inclusive/i);

      expect(excInput).toBeInTheDocument();
      expect(incInput).toBeInTheDocument();
      expect(saveFieldSpy).toHaveBeenCalled();

      await user.click(incInput);
      await user.keyboard('1151');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(incInput).toHaveDisplayValue('1,151');
      expect(saveFieldFn).toHaveBeenCalledWith(
        {
          name: expect.any(String),
          value: 1151,
        },
        true
      );
      expect(saveFieldFn).toHaveBeenCalledWith(
        {
          name: expect.any(String),
          value: 1001,
        },
        true
      );
    });
  });

  it('should should handle non-number inputs correctly', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    await act(() => render(<Default />));

    const incInput = screen.getByPlaceholderText(/gst inclusive/i);
    const excInput = screen.getByPlaceholderText(/gst exclusive/i);

    await user.click(excInput);
    await user.keyboard('abc');

    expect(excInput).toHaveDisplayValue('');
    expect(incInput).toHaveDisplayValue('');
  });

  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on when in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValueOnce({ options: [], isVisible, isEnabled: true });
    vi.spyOn(formField, 'useFormFieldGroup').mockReturnValueOnce({ render: renderFn });
    await act(() => render(<Default />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });

  it('should return a string if any falsy value is passed', async () => {
    expect(truthyOrString(0)).toBe('');
  });
});
