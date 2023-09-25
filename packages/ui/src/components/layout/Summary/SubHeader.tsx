import React, { useId } from 'react';
import classnames from 'classnames';

export type SubHeaderProps = {
  actionItems?: React.ReactNode[];
  longTitle?: boolean;
  text: string;
};

export function SubHeader({ actionItems, text }: SubHeaderProps) {
  return (
    <>
      <div
        id="summary-sub-header"
        data-testid="summary-sub-header"
        className={classnames(`min-h-10.5 flex items-center justify-between`, {})}
      >
        <h3 className="mr-3 flex-1 truncate text-xl">{text}</h3>
        <div className="flex gap-3">
          {actionItems ? actionItems.map((item: React.ReactNode) => <React.Fragment key={useId()}>{item}</React.Fragment>) : null}
        </div>
      </div>
    </>
  );
}

export function ActionItem() {
  return <div className="bg-field-bg h-10.5 flex w-[162px] items-center justify-center rounded">Dropdown Button</div>;
}
