import React from 'react';
import { act, render, renderHook, screen, userEvent } from '../../test/test-utils';
import { ApplicationMenu, useInitSectionStatus } from './ApplicationMenu';
import * as sectionStatus from '../../db/mappers/sections/hooks/useSectionStatus';

describe('menus/ApplicationMenu', () => {
  const selectedIdApplicationSummary = 'summary';
  const setDisplayId = vi.fn();
  const setJobId = vi.fn();
  const setForm = vi.fn();
  const mockHookSectionStatus = {
    jobId: '',
    setJobId: setJobId,
    form: '',
    setForm: setForm,
    selectedSectionId: '',
    setSelectedSectionId: setDisplayId,
  };

  const otherProps = {
    push: () => {
      return;
    },
    replace: () => {
      return;
    },
  };

  it('should render the Application summary button, sections and submit correctly', async () => {
    vi.spyOn(sectionStatus, 'useSectionStatus').mockReturnValue(mockHookSectionStatus);
    const user = userEvent.setup();

    render(<ApplicationMenu sectionLists={testSections} placeholder="No sections yet" jobId={'abc'} isOnline={true} {...otherProps} />);

    const applicationSummaryButton = screen.getByText('Application Summary');
    expect(applicationSummaryButton).toBeInTheDocument();
    expect(applicationSummaryButton).not.toHaveClass('bg-blue-240-active');

    await act(() => user.click(applicationSummaryButton));
    expect(setDisplayId).toHaveBeenCalled();
    expect(setDisplayId).toHaveBeenCalledWith(selectedIdApplicationSummary);

    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(8);

    expect(screen.getByTestId('display-id-Account')).toBeInTheDocument();
    expect(screen.getByTestId('display-id-Risk')).toHaveClass('hidden');

    const riskButton = screen.getByText('Risk');
    await act(() => user.click(riskButton));

    expect(screen.getByTestId('display-id-Risk')).not.toHaveClass('hidden');

    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it('should highlight the Application Summary button when its id is set as the selected id', async () => {
    vi.spyOn(sectionStatus, 'useSectionStatus').mockReturnValue({
      ...mockHookSectionStatus,
      selectedSectionId: selectedIdApplicationSummary,
    });
    render(<ApplicationMenu sectionLists={testSections} placeholder="No sections yet" jobId={'abc'} isOnline={true} {...otherProps} />);

    const applicationSummaryButton = screen.getByText('Application Summary');
    expect(applicationSummaryButton).toHaveClass('bg-blue-240-active');
  });

  it('should have overflow scroll set on the section container', async () => {
    render(<ApplicationMenu sectionLists={testSections} placeholder="No sections yet" jobId={'abc'} isOnline={true} {...otherProps} />);

    const housesSection = screen.getByTestId('sections-scroll-container');
    expect(housesSection).toBeInTheDocument();
    expect(housesSection).toHaveClass('overflow-auto');
  });

  it('should initialize the correct section status', async () => {
    vi.spyOn(sectionStatus, 'useSectionStatus').mockReturnValue({ ...mockHookSectionStatus, selectedSectionId: 'different_id' });
    renderHook(() => useInitSectionStatus({ jobId: 1, sectionId: selectedIdApplicationSummary }));
    expect(setDisplayId).toHaveBeenCalled();
    expect(setDisplayId).toHaveBeenCalledWith(selectedIdApplicationSummary);
  });
});

const testSections = [
  {
    title: 'Account',
    sectionList: [
      {
        name: 'Key Information',
        isGroup: false,
      },
    ],
  },
  {
    title: 'Declarations',
    sectionList: [
      {
        name: 'Disclosure Statement',
        isGroup: false,
      },
    ],
  },
  {
    title: 'Risk',
    sectionList: [
      {
        name: 'Houses',
        isGroup: true,
      },
    ],
  },
];
