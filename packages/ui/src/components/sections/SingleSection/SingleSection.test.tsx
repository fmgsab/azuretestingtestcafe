import React from 'react';
import { act, render, screen, userEvent } from '../../../test/test-utils';
import { MockDB } from '../../../test/mock-model-sections';
import * as hooks from '../hooks';
import { SingleSection, getId } from './SingleSection';

const db = new MockDB();

describe('sections/SingleSection', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const setIdFn = vi.fn();
  const statusMock = {
    selectedSectionId: null,
    setSelectedSectionId: setIdFn,
    form: '',
    setForm: vi.fn(),
    jobId: 0,
    setJobId: vi.fn(),
  };
  const statusSpy = vi.spyOn(hooks, 'useSectionStatus');

  const tblSpy = vi.spyOn(hooks, 'useSectionTable');

  it('should render correctly', async () => {
    const name = 'Single Item Example';
    const addFn = vi.fn().mockResolvedValue('1');
    const tblMock = {
      sections: [],
      addSection: addFn,
      updateSection: vi.fn(),
      removeSection: vi.fn(),
      table: vi.fn(),
    };
    const user = userEvent.setup();

    statusSpy.mockReturnValueOnce(statusMock);
    tblSpy.mockReturnValueOnce(tblMock);

    const { rerender } = render(<SingleSection name={name} />);

    expect(statusSpy).toHaveBeenCalled();
    expect(tblSpy).toHaveBeenCalledWith({ name });

    const titleElem = screen.getByText(name);
    expect(titleElem).toHaveClass('opacity-50');

    await act(() => user.click(titleElem));
    expect(addFn).toHaveBeenCalledTimes(1);
    expect(setIdFn).toHaveBeenCalledWith('1');

    statusSpy.mockReturnValueOnce({ ...statusMock, selectedSectionId: '1' });
    tblSpy.mockReturnValueOnce({ ...tblMock, sections: [{ id: 1, hasStarted: false }] });

    rerender(<SingleSection name={name} />);
    expect(titleElem).not.toHaveClass('opacity-50');

    await act(() => user.click(titleElem));
    expect(addFn).toHaveBeenCalledTimes(1); // no additional calls;
    expect(setIdFn).toHaveBeenCalledWith('1');
  });

  it('should calculate id based on arguments', () => {
    const bothDefined = getId('abc', 1);
    expect(bothDefined).toBe('abc_1');

    const onlyIdDefined = getId(undefined, 1);
    expect(onlyIdDefined).toBe('1');

    const onlyTblDefined = getId('abc', undefined);
    expect(onlyTblDefined).toBe('abc');

    const noneDefined = getId(undefined, undefined);
    expect(noneDefined).toBe('');
  });

  it('should handle when a table is passed in props', async () => {
    const addFn = vi.fn().mockResolvedValue('keyInfo_1');
    const mockedSection = {
      contactId: 'contact_1',
      jobId: 'application_1',
      type: 'keyInfo',
      name: 'Key Information',
      hasStarted: true,
      id: 1,
      hasCompleted: false,
      hasError: false,
    };
    const tblMock = {
      sections: [mockedSection],
      addSection: addFn,
      updateSection: vi.fn(),
      removeSection: vi.fn(),
      table: vi.fn(),
    };
    const user = userEvent.setup();

    statusSpy.mockReturnValueOnce(statusMock);
    tblSpy.mockReturnValueOnce(tblMock);

    const tableName = 'keyInfo';

    render(<SingleSection name={tableName} table={db.keyInfo} />);

    const titleElem = screen.getByRole('button');

    await act(() => user.click(titleElem));

    expect(addFn).toHaveBeenCalledTimes(0);
    expect(setIdFn).toHaveBeenCalledWith('keyInfo_1');
  });
});
