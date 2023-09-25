import { act, render, renderHook, screen, userEvent, withFormWrapper } from '../test/test-utils';
import { TextInput } from '../components/atoms/TextInput/TextInput';
import { Dropdown } from '../components/atoms/Dropdown/Dropdown';
import { Checkbox } from '../components/atoms/CheckBox/Checkbox';
import * as formUtil from '../hooks/useSaveField';
import * as scopeUtil from '../hooks/useScope';
import * as requiredUtil from '../hooks/useRequired';
import { getErrorMessage, isNestedFieldError, resolveError, useFormFieldGroup } from './useFormFieldGroup';

type TestData = {
  firstName: string;
  lastName: string;
  hasName?: boolean;
};

describe('useFormFieldGroup', () => {
  beforeEach(() => {
    vi.spyOn(scopeUtil, 'useScope').mockReturnValue({ isVisible: true, isEnabled: true });
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  const props = {
    question: 'Please enter your name',
    name: 'firstName',
    required: true,
    fields: [
      { name: 'firstName', label: 'First Name', component: TextInput },
      { name: 'lastName', label: 'Last Name', component: TextInput },
      { name: 'noMiddleName', label: 'No middle name', component: Checkbox },
    ],
  };

  const { question, required, fields } = props;

  it.each`
    disabled | opacity
    ${true}  | ${50}
    ${false} | ${75}
  `('should render correctly when disabled=$disabled', async ({ disabled, opacity }) => {
    const { result } = renderHook(() => useFormFieldGroup({ ...props, disabled }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
    });
    expect(result.current).toBeDefined();
    expect(result.current).toEqual(expect.objectContaining({ question, required, render: expect.any(Function) }));

    render(<>{result.current.render()}</>);

    const textboxes = screen.getAllByRole('textbox');
    expect(screen.queryByText(question)).toBeInTheDocument();
    expect(textboxes.length).toBe(fields.length - 1);
    expect(screen.queryByText(fields[0].label)).toBeInTheDocument();
    expect(screen.queryByText(fields[1].label)).toBeInTheDocument();
    expect(screen.queryByText(fields[0].label)).toHaveClass(`opacity-${opacity}`);
    expect(screen.queryByText(fields[1].label)).toHaveClass(`opacity-${opacity}`);

    await act(() => {
      result.current.setError?.('firstName', { type: 'custom', message: 'Custom message' });
    });
    expect(screen.queryByText('Custom message')).toBeInTheDocument();
  });

  it.each`
    required
    ${true}
    ${false}
  `('should not render question', async ({ required }) => {
    vi.spyOn(requiredUtil, 'useRequired').mockReturnValue(required);
    const { result } = renderHook(() => useFormFieldGroup({ ...props, question: undefined, required }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
    });
    expect(result.current).toBeDefined();

    render(<>{result.current.render()}</>);
    expect(screen.queryByText(question)).not.toBeInTheDocument();
    expect(screen.queryAllByText('*')).toHaveLength(Number(required));
  });

  it('should generate ids correctly', async () => {
    const { result } = renderHook(() => useFormFieldGroup({ ...props, name: '' }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
    });
    expect(result.current).toBeDefined();

    const { container } = render(<>{result.current.render()}</>);
    expect(container.querySelector('#question-please-enter-your-name')).toBeInTheDocument();
    expect(container.querySelector('#fields-please-enter-your-name')).toBeInTheDocument();
  });

  it.each`
    isVisible | count
    ${true}   | ${2}
    ${false}  | ${0}
  `('should determine visibility=$isVisible correctly', async ({ isVisible, count }) => {
    vi.spyOn(scopeUtil, 'useScope').mockReturnValue({ isVisible, isEnabled: true });
    const { result } = renderHook(() => useFormFieldGroup({ ...props, scope: {} }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
    });
    expect(result.current).toBeDefined();

    render(<>{result.current.render()}</>);
    expect(screen.queryAllByRole('textbox')).toHaveLength(count);
  });

  it.each`
    deferValidation | expected
    ${true}         | ${'deferred'}
    ${false}        | ${true}
  `('should determine required state=$expected correctly', async ({ deferValidation, expected }) => {
    const requiredSpy = vi.spyOn(requiredUtil, 'useRequired').mockReturnValue(true);
    const { result } = renderHook(() => useFormFieldGroup({ ...props, deferValidation }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
    });
    expect(result.current).toBeDefined();

    render(<>{result.current.render()}</>);
    expect(requiredSpy).toHaveBeenCalledWith(expect.any(String), expected);
  });

  it('should render opted in correctly', async () => {
    vi.clearAllMocks();
    const { result } = renderHook(
      () =>
        useFormFieldGroup({
          ...props,
          required: false,
          optedFor: 'hasName',
          fields: fields.map(({ name, component, label }) => ({ name, label, component })),
        }),
      {
        wrapper: withFormWrapper<TestData>({ defaultValues: { hasName: true } }),
      }
    );
    render(<>{result.current.render()}</>);
    expect(screen.getByText(/Yes/)).toBeInTheDocument();

    const optInCheck = screen.queryAllByRole('checkbox')[0];
    const nameField = screen.queryAllByRole('textbox')[0];
    expect(optInCheck).toHaveAttribute('checked');
    expect(nameField).not.toHaveAttribute('disabled');
    expect(screen.queryAllByText('*')).toHaveLength(1);
  });

  it('should render opted out correctly', async () => {
    const { result } = renderHook(
      () =>
        useFormFieldGroup({
          ...props,
          required: false,
          optedFor: 'hasName',
          fields: fields.map(({ name, component, label }) => ({ name, label, component })),
        }),
      {
        wrapper: withFormWrapper<TestData>({ defaultValues: { hasName: false } }),
      }
    );
    render(<>{result.current.render()}</>);
    expect(screen.getByText(/Yes/)).toBeInTheDocument();

    const optInCheck = screen.queryAllByRole('checkbox')[0];
    const nameField = screen.queryAllByRole('textbox')[0];
    expect(optInCheck).not.toHaveAttribute('checked');
    expect(nameField).toHaveAttribute('disabled');
    // TODO: succeeds when run individual but fails with other tests
    // expect(screen.queryAllByText('*')).toHaveLength(0);
  });

  it('should copy multi input props', async () => {
    const sizes = [4, 8];
    const multiFields = [
      { ...fields[0], size: sizes[0], disabled: true },
      { ...fields[1], size: sizes[1] },
    ];
    const { result } = renderHook(() => useFormFieldGroup({ ...props, isMultiInput: true, fields: multiFields }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
    });

    render(<>{result.current.render()}</>);

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes[0]).toHaveClass(`w-grid-${sizes[0]}`);
    expect(textboxes[0]).toBeDisabled();
    expect(textboxes[1]).toHaveClass(`w-grid-${sizes[1]}`);
    expect(textboxes[1]).toBeEnabled();
  });

  it('should render correctly with no sub-label', async () => {
    const { result } = renderHook(
      () => useFormFieldGroup({ ...props, required: false, fields: fields.map(({ name, component }) => ({ name, component })) }),
      {
        wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
      }
    );
    render(<>{result.current.render()}</>);

    expect(screen.queryByLabelText('required')).toBeNull();
    expect(screen.queryByText(fields[0].label)).toBeNull();
    expect(screen.queryByText(fields[1].label)).toBeNull();
  });

  it('should render Checkbox correctly with no sub-label', async () => {
    const { result } = renderHook(
      () =>
        useFormFieldGroup({ ...props, required: false, fields: fields.map(({ name, component, label }) => ({ name, label, component })) }),
      {
        wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
      }
    );
    render(<>{result.current.render()}</>);
    expect(screen.queryAllByText(fields[2].label).length).toBe(1);
  });

  it('should render accessory correctly', async () => {
    const renderAccessoryFn = vi.fn();
    const { result } = renderHook(
      () =>
        useFormFieldGroup({
          ...props,
          renderAccessory: renderAccessoryFn,
          required: false,
          fields: fields.map(({ name, component }) => ({ name, component })),
        }),
      {
        wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
      }
    );
    render(<>{result.current.render()}</>);
    expect(renderAccessoryFn).toHaveBeenCalled();
  });

  describe('test useSaveField', () => {
    it('should work correctly for TextInputWidget', async () => {
      const user = userEvent.setup();
      const saveField = vi.fn();
      vi.spyOn(formUtil, 'useSaveField').mockReturnValue(saveField);

      const { result } = renderHook(() => useFormFieldGroup(props), {
        wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
      });
      render(<>{result.current.render()}</>);

      const textbox = screen.getAllByRole('textbox')[0];
      const textContent = 'First name';

      await user.click(textbox);
      expect(textbox).toHaveFocus();

      await user.type(textbox, textContent);
      expect(textbox).toHaveValue(textContent);

      await user.tab();
      await expect(saveField).toHaveBeenCalledWith(expect.objectContaining({ name: 'firstName', value: textContent }));
    });

    it('should work correctly for Dropdown where incoming change is of OptionProps', async () => {
      const user = userEvent.setup();
      const saveField = vi.fn();
      vi.spyOn(formUtil, 'useSaveField').mockReturnValue(saveField);

      const options = [
        { value: '1', label: 'First' },
        { value: '2', label: 'Second' },
        { value: '3', label: 'Third' },
      ];

      const { result } = renderHook(() => useFormFieldGroup({ ...props, options, fields: [{ name: 'option', component: Dropdown }] }), {
        wrapper: withFormWrapper<TestData>({ defaultValues: {} }),
      });
      const { container } = render(<>{result.current.render()}</>);

      const combobox = screen.getByRole('combobox');
      await userEvent.click(combobox);
      expect(combobox).toHaveFocus();
      const menuList = container.querySelectorAll('div[id*=-option-]');
      expect(menuList).toHaveLength(options.length + 1);

      await user.click(menuList[0]);
      await user.tab();
      expect(saveField).toHaveBeenCalledWith(expect.objectContaining({ name: 'option' }));
    });
  });

  it('should return correct type guard result', async () => {
    expect(isNestedFieldError({ message: 'Required' })).toBeFalsy();
    expect(getErrorMessage({ message: 'Required' })).toBe('Required');
    expect(isNestedFieldError({ value: { message: 'Required' } })).toBeTruthy();
    expect(getErrorMessage({ value: { message: 'Required' } })).toBe('Required');
  });

  describe('resolveError', () => {
    const name = 'field1';
    const ref = { name };
    const errorShape = { ref, message: 'Required' };
    const requiredError = { ...errorShape, type: 'required_error', ref: {} };
    const invalidTypeError = { ...errorShape, type: 'invalid_type', ref: {} };
    const emptyError = { ...errorShape, type: 'too_small', ref: { ...ref, value: '' } };

    const customReqError = { ...errorShape, [name]: { type: 'custom' } };
    const customError = { [name]: { type: 'custom', message: 'custom error' } };

    it.each`
      testCase                    | error               | isRequired | expected
      ${'ignore required_error'}  | ${requiredError}    | ${false}   | ${null}
      ${'ignore too_small'}       | ${emptyError}       | ${false}   | ${null}
      ${'ignore required_error'}  | ${requiredError}    | ${true}    | ${requiredError}
      ${'ignore invalid_type'}    | ${invalidTypeError} | ${true}    | ${invalidTypeError}
      ${'return custom required'} | ${customReqError}   | ${false}   | ${null}
      ${'return custom required'} | ${customReqError}   | ${true}    | ${customReqError}
      ${'return custom'}          | ${customError}      | ${false}   | ${customError}
      ${'return custom'}          | ${customError}      | ${true}    | ${customError}
    `('should $testCase when isRequired=$isRequired when name matches', async ({ error, isRequired, expected }) => {
      expect(resolveError({ fieldState: { error, isDirty: true, isTouched: true }, isRequired })).toBe(expected);
    });

    it.each`
      testCase                    | error               | isDirty  | expected
      ${'ignore required_error'}  | ${requiredError}    | ${false} | ${null}
      ${'ignore too_small'}       | ${emptyError}       | ${false} | ${null}
      ${'ignore required_error'}  | ${requiredError}    | ${true}  | ${requiredError}
      ${'ignore invalid_type'}    | ${invalidTypeError} | ${true}  | ${invalidTypeError}
      ${'return custom required'} | ${customReqError}   | ${false} | ${null}
      ${'return custom required'} | ${customReqError}   | ${true}  | ${customReqError}
      ${'return custom'}          | ${customError}      | ${false} | ${customError}
      ${'return custom'}          | ${customError}      | ${true}  | ${customError}
    `('should $testCase when isDirty=$isDirty when name matches', async ({ error, isDirty, expected }) => {
      expect(resolveError({ fieldState: { error, isDirty, isTouched: false }, isRequired: true })).toBe(expected);
    });
  });
});
