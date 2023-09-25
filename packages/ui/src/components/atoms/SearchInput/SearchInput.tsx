import { useRef, useState } from 'react';
import classnames from 'classnames';

import { debounce } from '@fmg/utils';
import SearchIcon from '../../../assets/icons/18x18/search.svg';
import RemoveIcon from '../../../assets/icons/18x18/close.svg';

type ClearButtonProps = {
  onClick: (event: React.MouseEvent) => void;
  className?: string;
};

export function ClearButton({ onClick, className }: ClearButtonProps) {
  return (
    <span className={classnames('absolute right-0 flex w-9 ', className)}>
      <span
        role="button"
        onClick={onClick}
        className={classnames(
          'h-7.5 w-7.5 flex items-center justify-center gap-3 rounded-md',
          'group-hover:bg-fmg-gray-230 hover:bg-fmg-gray-330',
          'hover:transition group-hover:transition'
        )}
      >
        <RemoveIcon className={classnames('fill-fmg-gray-690')} />
      </span>
    </span>
  );
}

type SearchInputProps = {
  placeholder?: string;
  setValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
};

export function SearchInput({ setValue, placeholder = 'Filter', disabled }: SearchInputProps) {
  const [showClearButton, setShowClearButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const classes = classnames(
    `w-63 flex gap-1.5 items-center h-10.5 p-1.5`,
    'relative',
    'text-base font-300 rounded border-0 text-text-primary outline-0 bg-fmg-gray-80',
    { 'focus-within:bg-fmg-gray-230 peer-hover:bg-fmg-gray-230 hover:bg-fmg-gray-230 focus:bg-fmg-gray-230': !disabled }
    //{ 'bg-white hover:bg-white peer-hover:bg-white text-text-disabled': disabled }
  );

  const [handleChange] = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    updateValue(e.target.value);
  }, 250);

  const updateValue = (val?: string) => {
    if (inputRef.current) inputRef.current.value = val ?? '';
    setShowClearButton(Boolean(val));
    setValue?.(val);
  };

  return (
    <div className={classes}>
      <span className={classnames('mx-1.5')}>
        <SearchIcon className={classnames('fill-fmg-gray-690')} />
      </span>
      <ClearButton
        onClick={() => {
          updateValue(undefined);
        }}
        className={classnames({ block: showClearButton, hidden: !showClearButton })}
      />
      <input
        type="text"
        ref={inputRef}
        className={classnames('w-41 bg-transparent outline-0')}
        aria-label="search"
        onChange={handleChange}
        data-testid="native-input"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
