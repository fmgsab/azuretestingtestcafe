import { SectionItemGroupType } from '../db/section-types';
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { RowKeyType } from '../types';

type SectionsType = { title: string; sectionList: SectionItemGroupType[] }[];

/**
 * This hook watches an application to test if it can be submitted.
 * It checks:
 * 1 - online status
 * 2 - all Accounts and Declarations sections are completed
 * 3 - all started Risk sections are completed
 * 4 - at least one Risk section is completed
 */
export function useApplicationSubmission(jobId: RowKeyType, isOnline: boolean, sections: SectionsType): [boolean, () => void] {
  const [submissionEnabled, setSubmissionEnabled] = useState(false);

  const sectionsAccountsDeclarations = sections
    .filter((section) => ['Account', 'Declarations'].includes(section.title))
    .flatMap((s) => s.sectionList);
  const sectionsRisks = sections.filter((section) => ['Risk'].includes(section.title)).flatMap((s) => s.sectionList);

  const liveDataAccountsDeclarations = useLiveQuery(getAllPromises(sectionsAccountsDeclarations));
  const liveDataRisks = useLiveQuery(getAllPromises(sectionsRisks));

  useEffect(() => {
    const checker = () => {
      if (liveDataAccountsDeclarations && liveDataAccountsDeclarations?.length > 0 && liveDataRisks && liveDataRisks.length > 0) {
        // Calculate Accounts
        const completeAccountsFields = liveDataAccountsDeclarations.flat(2);
        const allCompleteAccounts =
          completeAccountsFields.length >= sectionsAccountsDeclarations.length &&
          completeAccountsFields.every((item) => item?.hasCompleted);

        // Calculate Risks
        const startedRisks = liveDataRisks.flat(2).filter((item) => item?.hasStarted);
        const atLeastOneStartedRisk = startedRisks.length > 0;
        const allStartedRisksAreComplete = startedRisks.every((item) => item?.hasCompleted);

        // Check all conditions are true
        const submissionEnabled = Boolean(isOnline && allCompleteAccounts && allStartedRisksAreComplete && atLeastOneStartedRisk);
        setSubmissionEnabled(submissionEnabled);
      } else {
        setSubmissionEnabled(false);
      }
    };

    checker();
  }, [liveDataAccountsDeclarations, liveDataRisks, isOnline, sectionsAccountsDeclarations.length]);

  return [submissionEnabled, handleSubmission];
}

function handleSubmission() {
  console.log('Application Submit button was clicked and the supplied function was executed.');
}

export default useApplicationSubmission;

export function getAllPromises(sectionsArray: SectionItemGroupType[]) {
  return () => {
    const promises = sectionsArray.map((section) => {
      return section.table?.where(section.uid)?.sortBy('created');
    });
    return Promise.all(promises);
  };
}
