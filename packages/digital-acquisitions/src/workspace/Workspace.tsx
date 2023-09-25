import React, { JSXElementConstructor } from 'react';
import classnames from 'classnames';

import { type RowKeyType, useOnlineContext, useSectionStatus } from '@fmg/ui';
import { FormVehicle, FormHouse, FormKeyInfo, FormBuildingFarm, FormBuildingCommercial, FormContent, FormOtherContent, FormBusInterruption, FormWatercraft } from '@fmg/forms';

import { ApplicationSummary } from '../panels/ApplicationSummary/ApplicationSummary';
import { usePageContext } from '../context/PageContext';

export type WorkspaceProps = {
  jobId?: RowKeyType;
  id?: RowKeyType;
  sectionName?: string;
  className?: string;
};

export function Workspace({ id, sectionName, className }: WorkspaceProps) {
  const isOnline = useOnlineContext();
  const { heights } = usePageContext();
  // There will always have been status already set from the application menu in nav
  const { selectedSectionId } = useSectionStatus();

  const [cachedSectionName, cachedId] = typeof selectedSectionId === 'string' ? selectedSectionId.split('_') : [];
  const uid = id ?? cachedId;

  const section = sectionName ?? cachedSectionName;

  const forms: Record<string, JSXElementConstructor<{ uid: RowKeyType | string }>> = {
    summary: ApplicationSummary,
    vehicle: FormVehicle,
    house: FormHouse,
    keyInfo: FormKeyInfo,
    otherContent: FormOtherContent,
    commercialBuilding: FormBuildingCommercial,
    farmBuilding: FormBuildingFarm,
    content: FormContent,
    busInterruption: FormBusInterruption,
    watercraft: FormWatercraft,
  };

  const renderMain = () => {
    const Component = forms[section];
    // TODO: Remove below if silly
    return Component ? <Component uid={uid} key={String(uid)} /> : <>{section ?? 'Nothing to show'}</>;
  };

  return <main className={classnames('w-full overflow-y-auto', heights[Number(isOnline)], className)}>{renderMain()}</main>;
}
