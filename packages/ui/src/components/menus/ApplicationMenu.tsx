import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import Tabs from '../tabs/Tabs/Tabs';
import { IdEnum } from '../tabs/tab-types';
import { TabsSectionsProps } from '../../db/section-types';
import { useSectionStatus } from '../../db/mappers/sections/hooks';
import ApplicationSummaryButton from '../atoms/Button/ApplicationSummaryButton';

import { RowKeyType } from '../../types';
import { NavContextProps, NavContext } from '../../context/NavContext';

import { MultiSection } from '../sections/MultiSection/MultiSection';
import { SingleSection } from '../sections/SingleSection/SingleSection';
import { DeleteConfirmation } from '../sections/DeleteConfirmation/DeleteConfirmation';
import { ApplicationSubmitButton } from './ApplicationSubmitButton';
import { useConfirmationReducer } from '../sections/hooks/useConfirmationReducer';

const applicationDisplayId = 'summary';

export type ApplicationMenuProps = TabsSectionsProps &
  Pick<NavContextProps, 'replace' | 'push'> & {
    jobId: RowKeyType;
    isOnline: boolean;
    sectionId?: string | string[];
  };

export type UseInitSectionStatusProps = Pick<ApplicationMenuProps, 'jobId' | 'sectionId'>;

export function useInitSectionStatus({ jobId, sectionId }: UseInitSectionStatusProps) {
  const { selectedSectionId, setSelectedSectionId, setJobId } = useSectionStatus();

  useEffect(() => {
    setJobId(jobId);
  }, [jobId, setJobId]);

  // TODO: cover in tests
  useEffect(() => {
    if (sectionId && sectionId !== selectedSectionId) {
      setSelectedSectionId(sectionId);
    }

    // TODO: better defaulting
    if (!sectionId && !selectedSectionId) {
      setSelectedSectionId('keyInfo');
    }
  }, [sectionId, selectedSectionId, setSelectedSectionId]);
}

export function ApplicationMenu({ jobId, sectionId, push, replace, ...props }: ApplicationMenuProps) {
  const { sectionLists, isOnline } = props;
  const [tabActiveId, setTabActiveId] = useState<IdEnum>('0');
  const { selectedSectionId, setSelectedSectionId } = useSectionStatus();

  useInitSectionStatus({ jobId, sectionId });

  const tabsWithOnClick = sectionLists.map((sectionList, tabIndex) => {
    return {
      title: sectionList.title,
      onClick: () => {
        setTabActiveId(`${tabIndex}` as IdEnum);
      },
    };
  });

  function handleSummaryClick() {
    setSelectedSectionId(applicationDisplayId);
    push(applicationDisplayId);
  }

  const isActive = applicationDisplayId === selectedSectionId;

  const { shouldConfirm, openConfirmation, toggleConfirmation, onConfirm } = useConfirmationReducer();

  return (
    <NavContext.Provider value={{ push, replace, shouldConfirm, openConfirmation, onConfirm }}>
      <div className="flex h-full w-full">
        <div className="flex w-full flex-col">
          <div className="border-border-gray p-4.5 w-full border pr-6">
            <ApplicationSummaryButton
              isActive={isActive}
              aria-label="Application Summary Button"
              className="mb-3"
              onClick={handleSummaryClick}
            >
              Application Summary
            </ApplicationSummaryButton>
            <Tabs activeId={tabActiveId} tabs={tabsWithOnClick} block={true} />
          </div>

          <div data-testid="sections-scroll-container" className="border-border-gray p-4.5 w-full flex-1 overflow-auto border border-t-0">
            {sectionLists.map((sectionGroup, sectionGroupIndex) => {
              const sectionList = sectionGroup.sectionList;
              return (
                <React.Fragment key={sectionGroupIndex}>
                  <div
                    data-testid={`display-id-${sectionGroup.title}`}
                    className={classnames('', {
                      visible: `${sectionGroupIndex}` === tabActiveId,
                      hidden: `${sectionGroupIndex}` !== tabActiveId,
                    })}
                  >
                    {sectionList.map((section, idx) => (
                      <React.Fragment key={idx}>
                        {section?.isGroup ? (
                          <MultiSection {...section} placeholder={props.placeholder} sectionLists={sectionLists} />
                        ) : (
                          <SingleSection {...section} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="border-border-gray p-4.5 w-full border border-t-0">
            <ApplicationSubmitButton isOnline={isOnline} sectionLists={{ jobId, sections: sectionLists }} />
          </div>
        </div>
        <DeleteConfirmation isOpen={shouldConfirm} toggleVisible={toggleConfirmation} />
      </div>
    </NavContext.Provider>
  );
}
