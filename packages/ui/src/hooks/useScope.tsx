import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { type OptionProps, type UseScopeProps, type UseScopeReturn } from '../types';
import { useResetFields } from './useResetFields';

/**
 * A custom hook to control conditional questions
 * This hook works based on an assumption that there's only one source
 * @param source source field name(s)
 * @param ctxOptions Parent context options for when nested scopes are used
 * @param condition
 * @param values in format of {first: [], second: []} which will then filtered by the condition
 * @param fieldsToReset field names to reset/invalidate when no condition is met
 * @param controlState to indicate whether to control visibility or enability of the target field
 * @param resetValue value to reset the target field to
 */
export function useScope({
  source,
  condition = true,
  values,
  options: ctxOptions,
  fieldsToReset = [],
  controlState = 'visible',
  resetValue = undefined,
}: UseScopeProps): UseScopeReturn {
  const { getValues } = useFormContext();
  // const fieldNamesRef = useRef(fieldsToReset);
  const resetFields = useResetFields(resetValue);

  const controlValue = getValues(source);

  const availableOptions = () => {
    if (source == null) return [];
    if (values == null) return undefined;

    return Object.entries(values).flatMap(([key, val]) => (key === controlValue ? val : []));
  };

  const evaluate = (): boolean => {
    if (source == null || !source.length) return true;

    if (typeof condition === 'function') {
      return condition(controlValue);
    }

    if (typeof controlValue === typeof condition) {
      return controlValue === condition;
    }

    return typeof condition === 'boolean' && condition;
  };

  // account for context options where applicable for nested scopes
  const isValidOption = () => {
    return ctxOptions?.length ? ctxOptions.find((option: OptionProps) => option.value === controlValue) != null : true;
  };

  const satisfied = evaluate() && isValidOption();

  const fieldsToResetSerialised = fieldsToReset.join(',');

  // TODO: tidy up & unify usage
  useEffect(() => {
    if (!fieldsToResetSerialised || satisfied) return;
    resetFields(fieldsToResetSerialised.split(','));
  }, [resetFields, satisfied, fieldsToResetSerialised]);

  const isVisible = controlState === 'visible' ? satisfied : true;
  const isEnabled = controlState === 'enabled' ? satisfied : true;

  return { isVisible, isEnabled, options: availableOptions() };
}
