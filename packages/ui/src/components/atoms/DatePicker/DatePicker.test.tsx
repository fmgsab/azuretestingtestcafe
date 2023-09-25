import React from 'react';
import { render, screen, userEvent } from '../../../test/test-utils';
import { DatePicker } from './DatePicker';
import * as saveField from '../../../hooks/useSaveField';
import { act } from '@testing-library/react';

describe('atoms/Datepicker', () => {
  it('should call handlers', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const saveFieldFn = vi.fn();
    await act(() => vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn));
    await act(() => render(<DatePicker name="test-picker" onChange={onChange} />));

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    await act(() => user.tab());
    await act(() => user.keyboard('02/02/2020'));
    await act(() => user.keyboard('{Enter}'));

    expect(onChange).toHaveBeenCalled();
  });

  const thisMonth = new Date().toLocaleString('default', { month: 'long' });
  const thisYear = new Date().getFullYear().toString();

  it.each`
    minDate         | maxDate         | expectedMonth  | expectedYear
    ${'2100-11-01'} | ${'2101-11-01'} | ${'November'}  | ${'2100'}
    ${'1800-09-01'} | ${'1801-09-01'} | ${'September'} | ${'1801'}
    ${'1800-09-01'} | ${'2100-09-01'} | ${thisMonth}   | ${thisYear}
  `(`Opens to the expected date =$openToDate`, async ({ minDate, maxDate, expectedMonth, expectedYear }) => {
    const user = userEvent.setup();
    await act(() => render(<DatePicker name="test-date-picker" minDate={new Date(minDate)} maxDate={new Date(maxDate)} />));

    await act(() => user.tab());
    const month = screen.getAllByText(expectedMonth);
    const year = screen.getAllByText(expectedYear);
    expect(month).toHaveLength(1);
    expect(year).toHaveLength(1);
  });

  it('should show value as passed into component', async () => {
    const user = userEvent.setup();
    await act(() =>
      render(<DatePicker name="test-date-picker" value={'2002-02-02'} minDate={new Date('1800-01-01')} maxDate={new Date('2100-01-01')} />)
    );
    await act(() => user.tab());
    const month = screen.getAllByText('February');
    const year = screen.getAllByText('2002');
    expect(month).toHaveLength(1);
    expect(year).toHaveLength(1);
  });

  it('should show only the relevant years and months', async () => {
    const minDate = new Date('2022-12-12');
    const maxDate = new Date('2024-01-12');
    const user = userEvent.setup();
    const { container } = render(<DatePicker name="test-date" value={'2024-01-01'} minDate={minDate} maxDate={maxDate} />);
    await user.tab();
    const valueContainers = container.querySelectorAll('div[class*=-ValueContainer]');
    expect(valueContainers).toBeDefined();
    expect(valueContainers).toHaveLength(2);

    const [monthsInput, yearsInput] = valueContainers;

    await user.click(monthsInput);

    const monthsList = container.querySelectorAll('div[id*=-option-]');
    expect(monthsList).toBeDefined();
    expect(monthsList).toHaveLength(1);

    await user.click(yearsInput);
    const y2022 = screen.getByText('2022');
    expect(y2022).toBeDefined();
    await user.click(y2022);

    await user.click(monthsInput);
    const monthsList2 = container.querySelectorAll('div[id*=-option-]');
    expect(monthsList2).toHaveLength(1);

    await user.click(yearsInput);
    const y2023 = screen.getByText('2023');
    await user.click(y2023);

    await user.click(monthsInput);
    const monthsList3 = container.querySelectorAll('div[id*=-option-]');
    expect(monthsList3).toHaveLength(12);

    const monthMarch = monthsList3[2];
    await user.click(monthMarch);
    expect(monthsInput).toHaveTextContent('March');
  });

  it('should show only the relevant months if range is within a single year', async () => {
    const minDate = new Date('2023-09-12');
    const maxDate = new Date('2023-11-12');
    const user = userEvent.setup();
    const { container } = render(<DatePicker name="test-date" value={'2023-11-01'} minDate={minDate} maxDate={maxDate} />);

    await user.tab();
    const valueContainers = container.querySelectorAll('div[class*=-ValueContainer]');
    const [monthsInput] = valueContainers;

    await user.click(monthsInput);
    const monthsList = container.querySelectorAll('div[id*=-option-]');
    expect(monthsList).toHaveLength(3);
  });
});
