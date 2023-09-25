import * as React from 'react';
import classnames from 'classnames';
import { AffixInput, AppendableList, Dropdown, MultiInputWidget, TextareaWidget, TextInput } from '@fmg/ui';
import { toNumber } from '@fmg/utils';
import Info from '@fmg/ui/src/assets/icons/18x18/info.svg';

import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';

export function BuildingAreas({
  name = 'buildingAreas',
  question = 'Building areas',
  disableFirstItem = true,
  lookupKey = 'buildingAreaTypes',
  fields = ['buildingAreas'],
  filterOptions = false,
}) {
  const { options, extraFieldValues } = useConditionalCriteria(lookupKey, { fields: fields });
  const [buildingAreas] = extraFieldValues;

  const suffix = 'm²';

  const totalArea = buildingAreas?.reduce((acc: number, { area }: Record<string, string>) => acc + toNumber(area), 0);
  const alert =
    totalArea > 0 ? (
      <span className={classnames('flex gap-1.5')}>
        <Info className={classnames('fill-fmg-green')} />
        These areas total {totalArea}
        {suffix}
      </span>
    ) : (
      ''
    );

  const isDisabled = (idx: number) => disableFirstItem && idx === 0;
  const getOptions = (idx: number) => (filterOptions && idx > 0 ? options.slice(1) : options);

  return (
    <AppendableList question={question} addButtonLabel="Add Building Area" name={name} alert={alert} required minLength={1}>
      {(idx: number) => (
        <>
          <MultiInputWidget name="" sizes={[4, 3, 3]} saveOnChange fixWidth>
            <Dropdown name="type" label="Type" options={getOptions(idx)} required disabled={isDisabled(idx)} />
            <TextInput name="year" label="Year" required />
            <AffixInput name="area" label="Area" suffix={suffix} decimalScale={0} required />
          </MultiInputWidget>
          <TextareaWidget name="description" label="Description" deferValidation={true} />
        </>
      )}
    </AppendableList>
  );
}
