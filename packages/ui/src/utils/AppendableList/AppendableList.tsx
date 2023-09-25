import React, { Children, cloneElement, ReactElement, useCallback, useRef } from 'react';
import { v4 } from 'uuid';
import classnames from 'classnames';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { DefaultValues } from 'react-hook-form/dist/types/form';
import { UseFieldArrayRemove } from 'react-hook-form/dist/types/fieldArray';

import { useSaveField } from '../../hooks';
import AddIcon from '../../assets/icons/18x18/plus.svg';
import RemoveIcon from '../../assets/icons/18x18/minus.svg';
import InlineButton from '../../components/atoms/Button/InlineButton';

type AppendableListProps = {
  question?: string;
  addButtonLabel: string;
  required?: boolean;
  name: string;
  minLength?: number;
  maxLength?: number;
  children: ReactElement | ReactElement[] | ((idx: number) => ReactElement);
  alert?: string | ReactElement;
  defaultValues?: DefaultValues<unknown>;
  repeatChildProps?: boolean;
};

export function AppendableList({
  question,
  name,
  required,
  addButtonLabel,
  children,
  minLength = 0,
  maxLength,
  defaultValues = {},
  alert,
  repeatChildProps = false,
}: AppendableListProps) {
  const saveField = useSaveField();
  const { control, watch, getValues } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name, rules: { required, minLength, maxLength } });
  const watchFieldArray = watch(name);

  const save = useCallback(
    (name: string) => {
      saveField({ name, value: getValues(name) });
    },
    [saveField, getValues]
  );

  const uuid = useRef(v4());

  const controlledFields = fields.map((field, index) => {
    // defaultValues in FormProvider is not saved to IDB, so force a memoized unique key
    const { key = uuid } = watchFieldArray[index];
    return {
      ...field,
      ...watchFieldArray[index],
      key,
    };
  });

  const childProps = (fieldIdx: number, childIdx: number) =>
    !repeatChildProps
      ? {
          question: fieldIdx + childIdx === 0 ? question : '',
          required: fieldIdx + childIdx === 0 ? required : false,
        }
      : {};

  const handleRemove: UseFieldArrayRemove = (props) => {
    remove(props);
    save(name);
  };

  const handleAdd = () => {
    append([{ ...defaultValues, key: v4() }]);
    save(name);
  };

  return (
    <>
      {controlledFields.map(({ key }, fieldIdx) => {
        const isDisabled = (controlledFields.length === 1 && fieldIdx === 0) || fieldIdx < minLength;

        const childElements = typeof children === 'function' ? children(fieldIdx).props.children ?? children(fieldIdx) : children;
        return (
          <React.Fragment key={key}>
            {Children.map(childElements, (child, childIdx) => {
              return (
                <>
                  {cloneElement(child, {
                    ...child.props,
                    name: `${name}.${fieldIdx}.${child.props.name}`,
                    ...childProps(fieldIdx, childIdx),
                    'aria-label': `${child.props.name} ${fieldIdx + 1}`,
                    renderAccessory: () =>
                      childIdx === 0 && (
                        <InlineButton
                          startIcon={
                            <RemoveIcon className={classnames({ 'fill-error': !isDisabled, 'fill-disabled-content': isDisabled })} />
                          }
                          aria-label="Remove"
                          color="remove"
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleRemove(fieldIdx)}
                          className="self-start"
                        ></InlineButton>
                      ),
                  })}
                </>
              );
            })}
          </React.Fragment>
        );
      })}
      <div className="form-fields">
        <div className={classnames('gap-4.5 grid w-full')}>
          {controlledFields.length && alert ? (
            <div className={classnames('gap-4.5 grid')}>
              {alert}
              <hr />
            </div>
          ) : null}
          <span>
            <InlineButton onClick={handleAdd} startIcon={<AddIcon />} aria-label={addButtonLabel} color="light" type="button">
              {addButtonLabel}
            </InlineButton>
          </span>
        </div>
      </div>
    </>
  );
}
