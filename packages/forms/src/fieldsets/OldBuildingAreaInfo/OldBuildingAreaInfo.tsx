import * as React from 'react';
import { RadioGroupWidget, Scope, useRequired, UseScopeProps } from '@fmg/ui';
import { oldBuildingYears, house } from 'models';

export function generateOptionLabel(label: string, certain: boolean) {
  return { value: label === 'Yes' ? 'true' : 'false', label: certain ? label : `${label}/don't know` };
}

export const options = {
  yes: (certain = true) => generateOptionLabel('Yes', certain),
  no: (certain = true) => generateOptionLabel('No', certain),
};

const getScope = (name: string, condition: () => boolean): UseScopeProps => ({
  source: 'buildingAreas',
  condition,
  fieldsToReset: [name],
});

export function Rewired() {
  const BASE_YEAR = oldBuildingYears.rewireOrReroof;
  const condition = house.isOldBuilding(BASE_YEAR);
  const targetCondition = ([buildingAreas, rewired]: [house.BuildingAreaType[], string]) => condition(buildingAreas) && rewired === 'false';

  return (
    <>
      <Scope highlight>
        <Scope.Source reference="buildingAreas">
          <RadioGroupWidget
            name="rewired"
            question="Rewired last 15 years"
            options={[options.yes(), options.no(false)]}
            scope={getScope('rewired', condition)}
            required="deferred"
          />
        </Scope.Source>
        <Scope.Target condition={targetCondition} name="wiringCert" shouldReset>
          <RadioGroupWidget name="wiringCert" question="Wiring certificate" options={[options.yes(), options.no()]} required />
        </Scope.Target>
      </Scope>
      <RadioGroupWidget
        name="reroofed"
        question="Reroofed last 20 years"
        options={[options.yes(), options.no(false)]}
        scope={getScope('reroofed', condition)}
        required="deferred"
      />
    </>
  );
}

export function OtherInfo() {
  const BASE_YEAR = oldBuildingYears.historicOrScrim;
  const condition = house.isOldBuilding(BASE_YEAR);

  return (
    <>
      <RadioGroupWidget
        name="historicPlace"
        question="Historic place"
        options={['No', 'Cat 1', 'Cat 2']}
        scope={getScope('historicPlace', condition)}
        required="deferred"
      />
      <RadioGroupWidget
        name="scrimPresent"
        question="Scrim present"
        options={[options.yes(false), options.no()]}
        scope={getScope('scrimPresent', condition)}
        required="deferred"
      />
    </>
  );
}

export function OldBuildingAreaInfo() {
  useRequired('buildingAreas', 'deferred');
  return (
    <>
      <Rewired />
      <OtherInfo />
    </>
  );
}
