import { AffixInput, MultiInputWidget, RadioGroupWidget, Scope, TextInputWidget, useSaveField, useSaveMultiFields } from '@fmg/ui';
import { toNumber } from '@fmg/utils';
import { operatorType } from 'models';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AddressSelect, ExcessContents, Options } from '../../fields';

const useFormValues = () => {
  const { getValues } = useFormContext();

  return {
    ...useWatch(),
    ...getValues(),
  };
};

type GstFieldProps = {
  fieldName: string;
  fields: string[];
  syncTo?: string;
  shouldSync?: boolean;
  shouldCopy?: boolean;
};

const useGstFields = ({ fieldName, fields, syncTo, shouldSync }: GstFieldProps) => {
  const { setValue, getFieldState } = useFormContext();
  const saveMultiFields = useSaveMultiFields();
  const values = useFormValues();

  const resetValue = '';

  const gstExclusiveField = fields[0];
  const gstInclusiveField = fields[1];

  const getPath = useCallback(
    (fieldName: string) => {
      return {
        gstExclusive: `${fieldName}.${gstExclusiveField}`,
        gstInclusive: `${fieldName}.${gstInclusiveField}`,
      };
    },
    [gstExclusiveField, gstInclusiveField]
  );

  const gstExclusivePath = getPath(fieldName).gstExclusive;
  const gstInclusivePath = getPath(fieldName).gstInclusive;

  const gstValues = values[fieldName];

  const syncFields = shouldSync && syncTo !== undefined;

  const calculateGstValues = useCallback((value: string) => {
    const valueAsNumber = toNumber(value);
    const asExGstNum = Math.round(valueAsNumber / 1.15);
    const asIncGstNum = Math.round(valueAsNumber * 1.15);
    const asExGstStr = asExGstNum ? String(asExGstNum) : resetValue;
    const asIncGstStr = asIncGstNum ? String(asIncGstNum) : resetValue;
    return { asExGstStr, asIncGstStr, asExGstNum, asIncGstNum };
  }, []);

  const handleSave = useCallback(() => {
    const { gstExclusive, gstInclusive } = gstValues;
    const { invalid } = getFieldState(fieldName);
    const { isDirty } = getFieldState(fieldName);

    if ((gstExclusive && invalid) || !isDirty) {
      return;
    }

    if (!gstExclusive || !gstInclusive || invalid) {
      setValue(
        fieldName,
        { [gstExclusiveField]: resetValue, [gstInclusiveField]: resetValue },
        { shouldValidate: true, shouldTouch: true }
      );
    }

    if (syncFields) {
      saveMultiFields({
        [gstExclusivePath]: gstExclusive.replace(/,/g, ''),
        [gstInclusivePath]: gstInclusive.replace(/,/g, ''),
        [getPath(syncTo).gstExclusive]: gstExclusive.replace(/,/g, ''),
        [getPath(syncTo).gstInclusive]: gstInclusive.replace(/,/g, ''),
      });
    } else {
      saveMultiFields({
        [gstExclusivePath]: gstExclusive.replace(/,/g, ''),
        [gstInclusivePath]: gstInclusive.replace(/,/g, ''),
      });
    }
  }, [
    fieldName,
    getFieldState,
    getPath,
    gstExclusiveField,
    gstExclusivePath,
    gstInclusiveField,
    gstInclusivePath,
    gstValues,
    saveMultiFields,
    setValue,
    syncFields,
    syncTo,
  ]);

  const handleSet = useCallback(
    (isExGst: boolean) => {
      const { gstExclusive, gstInclusive } = gstValues;
      const { asExGstStr, asIncGstStr } = calculateGstValues(isExGst ? gstExclusive : gstInclusive);

      if (isExGst) {
        setValue(
          fieldName,
          { [gstExclusiveField]: gstExclusive, [gstInclusiveField]: asIncGstStr },
          { shouldValidate: true, shouldTouch: true }
        );
        syncFields &&
          setValue(
            syncTo,
            { [gstExclusiveField]: gstExclusive, [gstInclusiveField]: asIncGstStr },
            { shouldValidate: true, shouldTouch: false }
          );
      } else {
        setValue(
          fieldName,
          { [gstExclusiveField]: asExGstStr, [gstInclusiveField]: gstInclusive },
          { shouldValidate: true, shouldTouch: true }
        );
        syncFields &&
          setValue(
            syncTo,
            { [gstExclusiveField]: asExGstStr, [gstInclusiveField]: gstInclusive },
            { shouldValidate: true, shouldTouch: false }
          );
      }
    },
    [calculateGstValues, fieldName, gstExclusiveField, gstInclusiveField, gstValues, setValue, syncFields, syncTo]
  );

  const handleCopy = useCallback(
    (copyFrom: string) => {
      const { gstExclusive, gstInclusive } = values[copyFrom];

      setValue(
        fieldName,
        { [gstExclusiveField]: gstExclusive, [gstInclusiveField]: gstInclusive },
        { shouldValidate: true, shouldTouch: true }
      );

      saveMultiFields({
        [gstExclusivePath]: gstExclusive.replace(/,/g, ''),
        [gstInclusivePath]: gstInclusive.replace(/,/g, ''),
      });
    },
    [fieldName, gstExclusiveField, gstExclusivePath, gstInclusiveField, gstInclusivePath, saveMultiFields, setValue, values]
  );

  return { handleSave, handleSet, handleCopy };
};
function SumInsuredWatched({ fieldName, fields, syncTo, shouldSync }: GstFieldProps) {
  const { handleSave, handleSet } = useGstFields({ fieldName, fields, syncTo, shouldSync });

  return (
    <>
      <MultiInputWidget name={fieldName} question="Sum Insured" sizes={[5, 5]} required saveOnChange={false}>
        <AffixInput
          prefix="$"
          name={fields[0]}
          label="GST Exclusive"
          maxLength={16}
          onChange={() => handleSet(true)}
          fieldHandlers={{ onBlur: () => handleSave() }}
          required
        />
        <AffixInput
          prefix="$"
          name={fields[1]}
          label="GST Inclusive"
          maxLength={16}
          required
          onChange={() => handleSet(false)}
          fieldHandlers={{ onBlur: () => handleSave() }}
        />
      </MultiInputWidget>
    </>
  );
}

function NonCollectionWatched({ fieldName, fields, syncTo, shouldCopy }: GstFieldProps) {
  const { handleSave, handleSet, handleCopy } = useGstFields({ fieldName, fields, syncTo });
  const saveField = useSaveField();

  const handleChange = ({ target: { value } }: { target: { value: string } }) => {
    if (value === 'true' && shouldCopy) {
      handleCopy('sumInsured');
    } else {
      saveField({ name: 'nonCollectionSumInsured', value: {} }, true);
    }
  };

  return (
    <>
      <Scope highlight>
        <Scope.Source>
          <RadioGroupWidget name="nonCollection" question="Non-collection" onChange={handleChange} required />
        </Scope.Source>

        <Scope.Target condition="true">
          <MultiInputWidget name={fieldName} question="Sum Insured" sizes={[5, 5]} required>
            <AffixInput
              prefix="$"
              name={fields[0]}
              label="GST Exclusive"
              maxLength={16}
              onChange={() => handleSet(true)}
              fieldHandlers={{ onBlur: () => handleSave() }}
              required
            />
            <AffixInput
              prefix="$"
              name={fields[1]}
              label="GST Inclusive"
              maxLength={16}
              onChange={() => handleSet(false)}
              fieldHandlers={{ onBlur: () => handleSave() }}
              required
            />
          </MultiInputWidget>
        </Scope.Target>
      </Scope>
    </>
  );
}

export const MilkContents = () => {
  return (
    <>
      <TextInputWidget name="name" question="Client description" maxLength={255} />
      <AddressSelect name="location" question="Location" mode="physical" />
      <Scope highlight>
        <Scope.Source>
          <Options name="operatorType" question="Type of operator" lookupKey="operatorTypes" hideIfEmpty />
        </Scope.Source>

        <Scope.Target
          condition={(val) =>
            [operatorType.sharemilkerInSharemilkingAgreement, operatorType.farmOwnerInSharemilkingAgreement].includes(val)
          }
          required
        >
          <Options name="shareMilkingAgreement" question="Sharemilking agreement" lookupKey="shareMilkingAgreement" required />
        </Scope.Target>
      </Scope>

      <MultiInputWidget name="milkCalcFields" question="Calculations, or other name here?" sizes={[4, 3, 3]} required>
        <AffixInput name="vatSize" label="Vat size/maximum possible loss (Litres)" isNumeric maxLength={20} />
        <AffixInput name="milkSolids" label="Milk solids (kgMS per L)" isNumeric prefix="%" maxLength={5} />
        <AffixInput name="milkPayout" label="Milk payout ($ per kgMS)" isNumeric prefix="$" maxLength={9} />
      </MultiInputWidget>

      <div className="row"></div>

      <SumInsuredWatched
        fieldName="sumInsured"
        fields={['gstExclusive', 'gstInclusive']}
        shouldSync={true}
        syncTo="nonCollectionSumInsured"
      />

      <ExcessContents hasDefault={false} />

      <NonCollectionWatched fieldName="nonCollectionSumInsured" fields={['gstExclusive', 'gstInclusive']} shouldCopy={true} />

      <RadioGroupWidget name="spoilageOrContamination" question="Spoilage or contamination" required />
    </>
  );
};
