import React from 'react';
import { IconTabsProps, IdEnum } from '../tab-types';
import classnames from 'classnames';

const durationMotion = 'duration-300';
const delayMotion = 'delay-100';

const Glider = ({ id }: { id: IdEnum }) => {
  return (
    <div
      className={classnames(`z-10 relative flex h-10.5 transition-transform ease-segmented-bounce-icons ${durationMotion}`, {
        'translate-x-[45px]': id !== '0',
      })}
    >
      <div className="bg-white flex-1 m-[3px] mr-0 rounded-[3px]"></div>
    </div>
  );
};

const Icon = ({
  activeId,
  handler,
  icon,
  positionId,
}: {
  activeId: string;
  handler: () => void;
  icon: React.ReactNode;
  positionId: IdEnum;
}) => {
  const isActive = activeId === positionId;

  const buttonBoxClasses = classnames('z-40 w-[48px] relative', {
    [`ml-0 mr-0 ease-out ${durationMotion}`]: positionId === '1' && isActive,
    [`ml-[100%] -mr-[100%] -translate-x-[48px] ease-out ${durationMotion}`]: positionId === '1' && !isActive,
  });

  const buttonClasses = classnames(
    `absolute top-[3px] bottom-[3px] left-[3px] right-[3px] flex justify-center items-center cursor-pointer rounded-[3px] p-[3px] focus:outline-0 ${durationMotion}`,
    {
      [`text-tabs-dark pointer-events-none bg-transparent ${durationMotion}`]: isActive,
      'text-tabs-light hover:bg-tabs-hover focus:bg-tabs-hover': !isActive,
    }
  );

  return (
    <div className={buttonBoxClasses}>
      <button type="button" onClick={handler} className={buttonClasses}>
        {icon}
      </button>
    </div>
  );
};

const Title = ({ text, activeId, positionId }: { text: string; activeId: string; positionId: string }) => {
  const isActive = activeId === positionId;

  const classes = classnames(`flex-1 flex justify-center items-center pr-[14px] pt-[3px] pointer-events-none font-medium -ml-[5.5px]`, {
    [`text-tabs-dark opacity-1 ease-in duration-200 ${delayMotion}`]: isActive,
    [`text-tabs-light opacity-0 ease-out ${delayMotion}`]: !isActive,
  });
  return <div className={classes}>{text}</div>;
};

const IconTitleGroup = ({ children, positionId }: { children: React.ReactNode; positionId: IdEnum }) => {
  return (
    <div
      className={classnames('z-20 relative flex h-10.5 w-full', {
        'translate-y-[-84px] translate-x-[48px]': positionId === '1',
        'translate-y-[-42px]': positionId !== '1',
      })}
    >
      {children}
    </div>
  );
};

export function IconTabs({ activeId, tabs }: IconTabsProps) {
  return (
    <div className="rounded-[6px] bg-tabs-bg text-tabs-light pr-[48px] overflow-hidden select-none">
      <div className="h-10.5">
        <Glider id={activeId} />
        {tabs?.map((tab, tabIndex) => {
          return (
            <IconTitleGroup key={tabIndex} positionId={`${tabIndex}` as IdEnum}>
              <Icon icon={tab.icon} positionId={`${tabIndex}` as IdEnum} activeId={activeId} handler={tab.onClick} />
              <Title text={tab.title} activeId={activeId} positionId={`${tabIndex}`} />
            </IconTitleGroup>
          );
        })}
      </div>
    </div>
  );
}

export default IconTabs;
