import React from 'react';
import { flexRender, Header, SortDirection, SortingState } from '@tanstack/react-table';
import { components, type Props } from 'react-select';
import classnames from 'classnames';

import ArrowUp from '../../../assets/icons/18x18/arrow-up.svg';
import ArrowDown from '../../../assets/icons/18x18/arrow-down.svg';
import { extractValues, isOption, isPlaceholder } from '../../../utils/options/options-util';
import Check from '../../../assets/icons/18x18/check.svg';

import { CustomDropdownProps } from '../../../types';
import Dropdown from '../../atoms/Dropdown/Dropdown';

export type SorterProps<T> = {
  name: string;
  headers: Header<T, unknown>[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  menuIsOpen?: Props['menuIsOpen'];
  placeholder?: CustomDropdownProps['placeholder'];
  disabled?: Props['isDisabled'];
};

export function Sorter<T>({ name, setSorting, headers, sorting = [], menuIsOpen, placeholder = false, disabled }: SorterProps<T>) {
  const options = headers.map((header) => {
    const label = flexRender(header.column.columnDef.header, header.getContext());
    return { label, value: header.id };
  });
  const [{ id: sortId } = { id: '' }] = sorting;

  const sortedColumn = headers.find((header) => header.id === sortId)?.column;

  const sizes = headers.map((header) => header.column.columnDef.size ?? 0);
  const maxSize = Math.max(...sizes);

  const handleChange: Props['onChange'] = (change: unknown) => {
    if (isOption(change)) {
      const value = extractValues(change);
      setSorting([{ id: value as string, desc: false }]);
    }
  };

  return (
    <div className={classnames('relative flex w-fit')}>
      <Dropdown
        name={name}
        isSearchable={false}
        onChange={handleChange}
        placeholder={placeholder}
        styles={{ container: () => ({ width: maxSize * 4 }) }}
        classNames={{
          container: (props) => classnames({ '!cursor-not-allowed bg-white': props.isDisabled }),
          control: ({ menuIsOpen }) =>
            classnames(
              'flex text-base border border-transparent rounded-md p-[11px] min-h-10.5',
              'hover:bg-fmg-gray-230',
              'transition ease-in',
              { 'bg-fmg-gray-230': menuIsOpen, 'bg-fmg-gray-80': !menuIsOpen }
            ),
          menu: () => classnames('!bg-white border rounded border-1 border-fmg-green !w-max overflow-hidden !min-w-full'),
          valueContainer: () => classnames('flex flex-wrap gap-1.5'),
          noOptionsMessage: () => 'p-3 !text-start',
        }}
        components={{
          Option: (props) => (
            <div
              className={classnames('h-10.5 flex flex-grow place-content-center p-3', {
                'bg-fmg-gray-80': props.isFocused,
                'active:bg-fmg-gray-80': !props.isDisabled,
                'text-field-text-placeholder': isPlaceholder(props.data),
              })}
            >
              <components.Option {...props}>{props.children}</components.Option>
              <Check className={classnames('fill-primary ml-2.5', { hidden: !props.isSelected })} />
            </div>
          ),
          // This will not be displayed and will always be overriden by the sort button below
          DropdownIndicator: () => <></>,
        }}
        options={options}
        value={sortId}
        menuIsOpen={menuIsOpen}
        disabled={disabled}
      />
      {renderSortButton(sortedColumn?.getIsSorted())}
      <span
        style={{ width: maxSize * 4 }}
        className={classnames({
          'bg-fmg-gray-80 min-h-10.5 absolute left-0 z-50 block cursor-not-allowed rounded-md': disabled,
          hidden: !disabled,
        })}
      />
    </div>
  );

  function renderSortButton(order: SortDirection | false = 'asc') {
    const config = {
      asc: { Icon: ArrowUp, 'aria-label': 'Ascending' },
      desc: { Icon: ArrowDown, 'aria-label': 'Descending' },
      false: { Icon: ArrowUp },
    };

    const key = String(order) as keyof typeof config;
    const { Icon, ...props } = config[key];

    return (
      <span
        className={classnames(
          'bg-fmg-gray-80 w-10.5 h-10.5 grid items-center justify-center rounded-r-md',
          'absolute right-0',
          'active:bg-fmg-gray-230 hover:bg-fmg-gray-230 transition duration-500 ease-out'
        )}
        role="button"
        onClick={sortedColumn?.getToggleSortingHandler()}
        {...props}
      >
        <Icon className={classnames('fill-fmg-gray-720 animate-sortDir')} />
      </span>
    );
  }
}
