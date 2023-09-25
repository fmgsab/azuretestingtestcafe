import React from 'react';
import Dropdown from './Dropdown';
import { Props } from 'react-select';
import Caret from '../../../assets/icons/18x18/caret.svg';
import Check from '../../../assets/icons/18x18/check.svg';
import { isPlaceholder } from '../../../utils/options/options-util';
import { components } from 'react-select';
import classnames from 'classnames';
import { CustomDropdownProps } from '../../../types';

export type TableFilterDropdownProps = {
  onChange: Props['onChange'];
  itemType?: string;
  address?: string;
  name: string;
  options: object;
  placeholder?: CustomDropdownProps['placeholder'];
};

const TableFilterDropdown = ({ options, name, onChange, placeholder }: TableFilterDropdownProps) => {
  return (
    <Dropdown
      name={name}
      className="w-grid-4"
      isSearchable={false}
      onChange={onChange}
      placeholder={placeholder}
      classNames={{
        container: (props) => classnames({ '!cursor-not-allowed bg-white': props.isDisabled }),
        control: ({ menuIsOpen, isFocused }) =>
          classnames(`flex text-base border rounded bg-field-bg hover:bg-field-bg-hover p-[11px] min-h-10.5`, {
            'border-1 bg-field-bg-focused': menuIsOpen || isFocused,
            'border-transparent': !menuIsOpen && !isFocused,
          }),
        menu: () => classnames('!bg-white border rounded border-1 border-fmg-green right-0 !w-max overflow-hidden !min-w-full'),
        valueContainer: () => classnames('flex flex-wrap gap-1.5 capitalize'),
        input: () => classnames('!text-base font-light'),
        noOptionsMessage: () => 'p-3 !text-start',
      }}
      components={{
        Option: (props) => (
          <div
            className={classnames('h-10.5 flex flex-grow place-content-center p-2.5 capitalize', {
              'bg-field-bg': props.isFocused,
              'active:bg-field-bg': !props.isDisabled,
              'text-field-text-placeholder': isPlaceholder(props.data),
            })}
          >
            <components.Option {...props}>{props.children}</components.Option>
            {props.isSelected ? <Check className={'fill-primary ml-2.5'} /> : ''}
          </div>
        ),
        DropdownIndicator: ({ isFocused, isDisabled }) => (
          <Caret
            className={classnames({
              'fill-field-fill-black-24': isFocused,
              'fill-field-fill-black-75': isDisabled,
            })}
          />
        ),
      }}
      {...options}
    />
  );
};

export default TableFilterDropdown;
