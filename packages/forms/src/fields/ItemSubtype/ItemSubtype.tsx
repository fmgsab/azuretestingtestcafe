import React from 'react';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { AbstractFieldProps } from '../fields';
import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import { itemTypes, nq } from 'models';

export function ItemSubtype({ as = 'list', required, onChange }: AbstractFieldProps) {
  const {
    fieldValues: [itemType],
    options,
    defaultValue,
  } = useConditionalCriteria('itemSubtypes');

  const question = () => {
    switch (itemType) {
      case 'vehicle':
        return 'Vehicle type';
      case 'watercraft':
        return 'Boat Type';
      case 'content':
      case 'otherContent':
        return 'Contents type';
      case 'busInterruption':
        return 'Business Operations';
      case itemTypes.farmBuilding.value:
      case itemTypes.commercialBuilding.value:
        return nq.buildingType.question;
      default:
        return 'Type';
    }
  };

  return (
    <OptionsViewer
      as={as}
      name="itemSubtype"
      question={question()}
      options={options}
      defaultValue={defaultValue}
      required={required}
      onChange={onChange}
    />
  );
}
