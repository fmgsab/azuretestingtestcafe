import { useFormContext } from 'react-hook-form';
import { dd } from 'models/src/data-dictionary/data-dictionary';

export type UseConditionalCriteriaOption = {
  fields?: string[];
  hasDefault?: boolean;
};

/**
 * Custom hook to evaluate conditionals based on data dictionary
 * @param key search key for data dictionary
 * @param fields additional field names
 * @param hasDefault
 */
export function useConditionalCriteria(key: string, { fields = [], hasDefault = false }: UseConditionalCriteriaOption = {}) {
  const { getValues } = useFormContext();
  const filteredFields = fields.filter(Boolean);
  const fieldsToWatch = ['itemType', 'itemSubtype', 'usage', 'coverType', ...filteredFields];
  const fieldValues = getValues(fieldsToWatch);
  const result = dd.get(key)(fieldValues, fieldsToWatch);
  const options = Array.isArray(result) ? result : [];
  // This might change in the future
  const defaultValue = hasDefault ? options[0]?.value ?? options[0] : undefined;

  return { fields: fieldsToWatch, fieldValues, result, options, defaultValue, extraFieldValues: fieldValues.slice(4) };
}
