import React from 'react';
import Button from '../atoms/Button/Button';
import { RowKeyType } from '../../types';
import useApplicationSubmission from '../../hooks/useApplicationSubmission';
import { SectionItemGroupType } from '../../db/section-types';

export function ApplicationSubmitButton({
  isOnline,
  sectionLists,
}: {
  isOnline: boolean;
  sectionLists: {
    jobId: RowKeyType;
    sections: { title: string; sectionList: SectionItemGroupType[] }[];
  };
}) {
  const { jobId, sections } = sectionLists;

  const [submitEnabled, handleSubmit] = useApplicationSubmission(jobId, isOnline, sections);

  return (
    <Button block={true} aria-label="submit button" color="primary" disabled={!submitEnabled} onClick={() => handleSubmit()}>
      Submit
    </Button>
  );
}
