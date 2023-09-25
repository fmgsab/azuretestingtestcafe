import React from 'react';
import classnames from 'classnames';
import InlineButton from '../../atoms/Button/InlineButton';
import Close from '../../../assets/icons/18x18/close.svg';
import Arrow from '../../../assets/icons/18x18/arrow-left.svg';
import Hamburger from '../../../assets/icons/18x18/hamburger.svg';

export type MenuHeaderProps = {
  className?: string;
  width?: number;
  isOpen?: boolean;
  toggle?: () => void;
  returnHome?: () => void;
};

// TODO: write snapshot testing
export function MenuHeader({ className, width = 0, isOpen, toggle, returnHome }: MenuHeaderProps) {
  // tailwind-safelist left-[348px] left-[402px]
  const toggleStart = width - 18 * 3;

  const ICON_CLASS = classnames('fill-white');
  const MD_HIDDEN = 'md:hidden';

  const INVISIBLE = 'invisible opacity-0 transition-opacity';
  const VISIBLE = 'visible opacity-100 transition-opacity delay-350';

  return (
    <>
      <input
        id="toggle-menu"
        name="toggle-menu"
        data-test-id="toogle-menu-trigger"
        type="checkbox"
        className={classnames('peer absolute opacity-0', `checked:left-[${toggleStart}px]`, MD_HIDDEN)}
        checked={isOpen}
        onChange={toggle}
      />
      <label htmlFor="toggle-menu" className={classnames('h-1 w-1 opacity-0')}>
        Toggle menu
      </label>
      <InlineButton
        color="secondary"
        aria-label="Open menu"
        className={classnames(
          `left-4.5 top-4.5 absolute z-40`,
          {
            [VISIBLE]: !isOpen,
            [INVISIBLE]: isOpen,
          },
          MD_HIDDEN
        )}
        startIcon={<Hamburger className={ICON_CLASS} />}
        onClick={toggle}
      />
      <InlineButton
        color="secondary"
        aria-label="Close"
        className={classnames(
          `top-4.5 absolute left-[${toggleStart}px] z-40`,
          {
            [VISIBLE]: isOpen,
            [INVISIBLE]: !isOpen,
          },
          MD_HIDDEN
        )}
        startIcon={<Close className={ICON_CLASS} />}
        onClick={toggle}
      />
      <div
        className={classnames(
          `bg-fmg-green h-18 p-4.5 left-0 top-0 z-30 w-[${width}px]`,
          'grid items-center justify-start',
          'shadow-[0_1px_6px_rgba(0,0,0,0.3)]',
          MD_HIDDEN,
          className
        )}
      >
        <InlineButton
          color="secondary"
          aria-label="back to dashboard"
          startIcon={<Arrow className={ICON_CLASS} />}
          onClick={() => {
            toggle?.();
            setTimeout(() => returnHome?.(), 300);
          }}
        >
          Back to dashboard
        </InlineButton>
      </div>
      <div
        onClick={toggle}
        className={classnames(
          'delay-50 absolute left-0 top-0 -z-50 h-full w-full bg-black opacity-0 transition-opacity duration-200',
          `peer-checked:z-10 peer-checked:opacity-[33%]`,
          MD_HIDDEN
        )}
      />
    </>
  );
}
