import { act, screen, render, userEvent, composeStories } from '../../../test/test-utils';
import * as modelContext from '../../../context/ModelContext';
import * as scope from '../../../hooks/useScope';
import * as saveField from '../../../hooks/useSaveField';
import * as formFieldGroup from '../../../hooks/useFormFieldGroup';
import * as stories from './CheckboxGroupWidget.stories';
import * as model from '../../../test/mock-model';

const { Basic } = composeStories(stories);

describe('form-widgets/Checkbox', () => {
  afterAll(() => vi.clearAllMocks());

  it('should render', async () => {
    await act(() => render(<Basic />));

    const input = screen.getByTestId('checkbox-group-statementDelivery');
    expect(input).toBeInTheDocument();
  });

  it('should invoke saveField correctly', async () => {
    const db = new model.MockDB('TestDB', { statementDelivery: '++, statementDelivery' });
    vi.spyOn(modelContext, 'useModelContext').mockReturnValue({
      table: db.statementDelivery,
      schema: {},
      uid: 0,
    });

    const saveFieldFn = vi.fn();
    vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    const user = userEvent.setup();
    await act(() => render(<Basic />));

    const input = screen.getByTestId('checkbox-statementDelivery-email');
    expect(input).toBeInTheDocument();

    await user.click(input);
    await expect(saveFieldFn).toHaveBeenCalled();
  });

  it('should call saveField onChange', async () => {
    const saveFieldSpy = vi.spyOn(saveField, 'useSaveField');

    await act(() => render(<Basic />));

    const input = screen.getByTestId('checkbox-statementDelivery-post');
    expect(input).toBeInTheDocument();

    await userEvent.click(input);

    expect(saveFieldSpy).toHaveBeenCalled();
    expect(input).toBeChecked();

    await userEvent.click(input);
    expect(input).not.toBeChecked();
  });

  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on when in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValueOnce({ options: [], isVisible, isEnabled: true });
    vi.spyOn(formFieldGroup, 'useFormFieldGroup').mockReturnValueOnce({ render: renderFn });
    await act(() => render(<Basic />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });

  it.each`
    cols         | className
    ${3}         | ${'grid grid-cols-3 sm:grid-cols-3'}
    ${undefined} | ${'flex flex-wrap'}
  `('should render with grid when cols arg is defined', async ({ cols, className }) => {
    await act(() => render(<Basic cols={cols} name="statementDelivery" />));

    const input = screen.getByTestId('checkbox-group-statementDelivery');
    expect(input).toHaveClass(className);
  });
});
