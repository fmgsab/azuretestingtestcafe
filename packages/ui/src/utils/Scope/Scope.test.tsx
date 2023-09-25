import { act, render, renderHook, screen, withFormWrapper } from '../../test/test-utils';
import * as React from 'react';
import { z } from 'zod';
import { UseScopeProps } from '../../types';
import * as scopeContext from '../../context/ScopeContext';
import * as scopeHook from '../../hooks/useScope';
import { Scope, ScopedGroup, useScopeRoot } from './Scope';
import { Globals } from '@react-spring/web';
import { RadioGroupWidget } from '../../components/form-widgets';
import TextInputWidget from '../../components/form-widgets/TextInput/TextInputWidget';

const schema = z.object({
  ref: z.number().optional(),
  accountType: z.string(),
  accountTypeOther: z.string(),
});

export type FormValues = z.infer<typeof schema>;

const accountTypes = [
  { id: 'person', label: 'Person', value: 'person' },
  { id: 'collective', label: 'Collective', value: 'col' },
  { id: 'trust', label: 'Trust', value: 'trust' },
  { id: 'partnership', label: 'Partnership', value: 'partnership' },
  { id: 'trader', label: 'Trader', value: 'trader' },
  { id: 'ltd', label: 'Limited Company', value: 'ltd' },
  { id: 'other', label: 'Other', value: 'other' },
];

beforeAll(() => {
  Globals.assign({
    skipAnimation: true,
  });

  vi.useFakeTimers();
});

afterAll(() => {
  vi.clearAllTimers();
});

function ScopeComponent({
  condition,
  reference,
  shouldReset,
}: {
  condition?: UseScopeProps['condition'];
  reference?: string | string[];
  shouldReset?: boolean;
}) {
  return (
    <Scope highlight>
      <Scope.Source reference={reference}>
        <RadioGroupWidget name="accountType" question="Account type" options={accountTypes} cols={3} size={10} required />
      </Scope.Source>
      <Scope.Target condition={condition} shouldReset={shouldReset}>
        <TextInputWidget name="accountTypeOther" question="Please specify account type" size={12} required />
      </Scope.Target>
    </Scope>
  );
}

describe('Scope', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('useScopeRoot', () => {
    it('should render hook correctly', () => {
      const { result } = renderHook(useScopeRoot);

      act(() => {
        result.current.registerTarget('id1', false);
      });
      expect(result.current.hasVisibleTarget()).toBeFalsy();

      act(() => {
        result.current.registerTarget('id2', true);
      });
      expect(result.current.hasVisibleTarget()).toBeTruthy();
    });
  });

  describe('ScopedGroup', () => {
    const textContent = 'textContent';
    it('should render correctly', async () => {
      render(
        <ScopedGroup>
          <>{textContent}</>
        </ScopedGroup>
      );
      expect(screen.getByText('textContent')).toHaveClass('scoped-group');
    });

    it('should style correctly', async () => {
      const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
      useScopeContextSpy.mockReturnValue({ highlight: true, isExpanded: true, source: '', inline: false });
      render(
        <ScopedGroup>
          <>{textContent}</>
        </ScopedGroup>
      );
      expect(useScopeContextSpy).toHaveBeenCalled();
      expect(screen.getByText('textContent').className).toContain('bg-fmg-green-3');
    });
  });

  it.each`
    testCase                                | condition    | hasVisibleTarget
    ${'no condition and visible target'}    | ${undefined} | ${true}
    ${'condition and visible target'}       | ${'other'}   | ${true}
    ${'no condition and no visible target'} | ${undefined} | ${false}
    ${'condition and no visible target'}    | ${'other'}   | ${false}
  `('should set value correctly when $testCase', async ({ condition, hasVisibleTarget }) => {
    const setIsRootExpanded = vi.fn();
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
    useScopeContextSpy.mockReturnValue({
      inline: false,
      highlight: true,
      source: 'accountType',
      hasVisibleTarget: () => hasVisibleTarget,
      setIsExpanded: setIsRootExpanded,
    });

    render(<ScopeComponent condition={condition} />, { wrapper: withFormWrapper<FormValues>({ defaultValues: {} }) });
    expect(setIsRootExpanded).toHaveBeenCalledWith(Boolean(condition) && hasVisibleTarget);
  });

  it('should set value correctly for when having reference', async () => {
    const setIsRootExpanded = vi.fn();
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
    useScopeContextSpy.mockReturnValue({
      highlight: true,
      source: 'accountType',
      hasVisibleTarget: () => true,
      setIsExpanded: setIsRootExpanded,
      inline: false,
    });

    const { rerender } = render(
      <ScopeComponent condition={([ref, accountType]) => ref === 1 && accountType === 'other'} reference="ref" />,
      {
        wrapper: withFormWrapper<FormValues>({ defaultValues: { ref: 1 } }),
      }
    );
    expect(setIsRootExpanded).toHaveBeenCalledWith(true);

    rerender(<ScopeComponent condition={([ref, accountType]) => ref === 1 && accountType === 'other'} reference={['ref']} />);
    expect(setIsRootExpanded).toHaveBeenCalledWith(true);
  });

  it.each`
    highlight | fnCallTimes
    ${true}   | ${1}
    ${false}  | ${1}
  `('should register target depending on whenter Root=$isRoot', async ({ highlight, fnCallTimes }) => {
    const registerTarget = vi.fn();
    const setIsExpanded = vi.fn();
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
    useScopeContextSpy.mockReturnValue({ highlight, source: 'accountType', registerTarget, setIsExpanded, inline: false });

    render(<ScopeComponent />, { wrapper: withFormWrapper<FormValues>({ defaultValues: {} }) });
    expect(registerTarget).toHaveBeenCalledTimes(fnCallTimes);
    expect(setIsExpanded).toHaveBeenCalledTimes(fnCallTimes);
  });

  it.each`
    isVisible
    ${true}
    ${false}
  `('should show/hide target correctly when evaluated visibility=$isVisible', async ({ isVisible }) => {
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
    useScopeContextSpy.mockReturnValue({ highlight: true, source: 'accountType', inline: false });
    const useScopeSpy = vi.spyOn(scopeHook, 'useScope');
    useScopeSpy.mockReturnValue({ isVisible, isEnabled: true });

    render(<ScopeComponent />, { wrapper: withFormWrapper<FormValues>({ defaultValues: {} }) });
    vi.advanceTimersByTime(1000);

    const textInputField = await screen.queryByRole('textbox');
    expect(Boolean(textInputField)).toBe(isVisible);
  });

  it.each`
    shouldReset | fieldsToReset
    ${true}     | ${['accountTypeOther']}
    ${false}    | ${[]}
  `(`should pass field names $fieldsToReset to reset when shouldReset=$shouldReset`, async ({ shouldReset, fieldsToReset }) => {
    const context = { highlight: true, source: 'accountType', inline: true };
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
    useScopeContextSpy.mockReturnValue(context);
    const useScopeSpy = vi.spyOn(scopeHook, 'useScope');

    render(<ScopeComponent shouldReset={shouldReset} />, { wrapper: withFormWrapper<FormValues>({ defaultValues: {} }) });

    expect(useScopeSpy).toHaveBeenCalledWith(expect.objectContaining({ fieldsToReset }));
  });

  it.each`
    reference    | source
    ${'ref1'}    | ${['ref1', 'accountType']}
    ${[]}        | ${'accountType'}
    ${undefined} | ${'accountType'}
  `(`should set source correctly when reference=$reference`, async ({ reference, source }) => {
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');

    render(<ScopeComponent reference={reference} />, { wrapper: withFormWrapper<FormValues>({ defaultValues: {} }) });

    expect(useScopeContextSpy).toHaveLastReturnedWith(expect.objectContaining({ source }));
  });
});
