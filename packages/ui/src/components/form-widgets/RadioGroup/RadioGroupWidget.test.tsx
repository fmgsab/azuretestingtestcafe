import React from 'react';
import { act, composeStories, render, screen, userEvent, waitFor } from '../../../test/test-utils';

import * as modelContext from '../../../context/ModelContext';
import * as saveField from '../../../hooks/useSaveField';
import * as formField from '../../../hooks/useFormField';
import * as stories from './RadioGroupWidget.stories';
import * as model from '../../../test/mock-model';
import { RadioGroupInput } from './RadioGroupWidget';

const { Default } = composeStories(stories);

describe('form-widgets/RadioGroup', () => {
  afterAll(() => vi.clearAllMocks());

  it('should render field without onChange', async () => {
    const renderFieldSpy = vi.spyOn(formField, 'useFormField');
    await act(() => render(<Default />));

    expect(renderFieldSpy).not.toHaveBeenCalledWith(expect.objectContaining({ onChange: expect.any(Function) }));
  });

  it('should be able to select using arrow keys', async () => {
    const user = userEvent.setup();
    const { container } = await act(() => render(<Default />));

    const inputs = screen.getAllByRole('radio');

    await user.click(container);
    await user.tab();
    expect(inputs[0]).toHaveFocus();

    await user.type(inputs[0], '{Space}');
    expect(inputs[0]).toBeChecked();

    await user.keyboard('{ArrowRight}');
    expect(inputs[0]).not.toBeChecked();

    // why not inputs[1]...???
    await waitFor(() => expect(inputs[2]).toBeChecked());
  });

  it('should render field with onChange', async () => {
    const db = new model.MockDB('TestDB', { friends: '++, name, age' });
    vi.spyOn(modelContext, 'useModelContext').mockReturnValue({ table: db.friends, schema: {}, uid: 0 });

    const saveFieldSpy = vi.spyOn(saveField, 'useSaveField');
    const renderFieldSpy = vi.spyOn(formField, 'useFormField');
    await act(() => render(<Default />));

    expect(saveFieldSpy).toHaveBeenCalled();
    expect(renderFieldSpy).toHaveBeenCalled();
  });

  it('should invoke saveField correctly', async () => {
    const db = new model.MockDB('TestDB', { friends: '++, name, age' });
    vi.spyOn(modelContext, 'useModelContext').mockReturnValue({ table: db.friends, schema: {}, uid: 0 });

    const saveFieldFn = vi.fn();
    const safeFieldSpy = vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    const fieldName = 'friends';
    const user = userEvent.setup();
    await act(() => render(<Default name={fieldName} />));
    expect(safeFieldSpy).toHaveBeenCalled();

    const input = screen.getAllByRole('radio')[0];
    expect(input).toBeInTheDocument();

    await user.click(input);
    expect(saveFieldFn).toHaveBeenCalledWith({ name: fieldName, value: 'Option 1' });
  });

  it.each`
    cols         | className
    ${3}         | ${'grid auto-cols-auto sm:grid-cols-3'}
    ${undefined} | ${'flex'}
  `('should render correctly with $className', async ({ cols, className }) => {
    const {
      container: {
        children: [radioGroup],
      },
    } = await act(() => render(<RadioGroupInput cols={cols} name="Default" />));

    expect(radioGroup).toHaveClass(className);
  });
});
