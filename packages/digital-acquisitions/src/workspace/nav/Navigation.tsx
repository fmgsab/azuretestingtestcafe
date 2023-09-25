import React, { useEffect, useState } from 'react';
import { ApplicationMenu, type RowKeyType, MenuHeader, type NavContextProps, useOnlineContext, useSectionStatus } from '@fmg/ui';

import sections from './sections';
import { usePageContext } from '../../context/PageContext';
import classnames from 'classnames';

export type NavigationProps = Pick<NavContextProps, 'replace' | 'push'> & {
  jobId: RowKeyType;
  fid?: string | string[];
  returnHome?: () => void;
};

// TODO: write snapshot testing
export function Navigation({ push, replace, jobId, fid, returnHome }: NavigationProps) {
  const isOnline = useOnlineContext();
  const { heights } = usePageContext();
  const { selectedSectionId } = useSectionStatus();

  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(false);
  }, [selectedSectionId]);

  // tailwind-safelist: md:h-[calc(100vh-100px)] md:h-[calc(100vh-72px)]
  const TRANSLATE =
    '-translate-x-full absolute transition duration-500 delay-100 ease-out peer-checked:translate-x-0 peer-checked:duration-300';
  const WIDTH = 402;
  return (
    <>
      <MenuHeader className={TRANSLATE} width={WIDTH} toggle={() => setChecked(!checked)} isOpen={checked} returnHome={returnHome} />

      <nav
        className={classnames(
          `z-30 flex w-[${WIDTH}px] bg-white`,
          TRANSLATE,
          `md:translate-x-0`,
          heights[1],
          `md:${heights[Number(isOnline)]}`,
          { '-translate-y-6 md:-translate-y-0': !isOnline }
        )}
      >
        <ApplicationMenu
          sectionId={fid}
          jobId={jobId}
          isOnline={isOnline ?? false}
          placeholder="No items added"
          sectionLists={sections(jobId)}
          push={push}
          replace={replace}
        />
      </nav>
    </>
  );
}
