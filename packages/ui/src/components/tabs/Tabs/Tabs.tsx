import React from 'react';
import { IdEnum, TextTabsProps } from '../tab-types';
import classnames from 'classnames';

const durationMotion = 'duration-300';

const Glider = ({ id, size }: { id: IdEnum; size: number }) => {
  return (
    <div
      className={classnames(`z-10 absolute flex h-10.5 py-[3px] transition-transform ease-segmented-bounce ${durationMotion}`, {
        'w-[50%]': size === 2,
        'w-[33.333%]': size === 3,
        'translate-x-[100%]': id === '1',
        'translate-x-[200%]': id === '2',
      })}
    >
      <div className="bg-white flex-1 mx-[1.5px] rounded-[3px]"></div>
    </div>
  );
};

const Title = ({ text, activeId, titleId, handler }: { text: string; activeId: string; titleId: string; handler: () => void }) => {
  const isActive = activeId === titleId;

  const classesBox = classnames(`z-20 flex py-[3px] px-[1.5px] bg-transparent`);

  const classesButton = classnames(`z-20 flex flex-1 justify-center items-center px-3 rounded-[3px] focus:outline-0 font-medium`, {
    [`text-tabs-dark pointer-events-none hover:bg-none`]: isActive,
    [`text-tabs-light hover:bg-tabs-hover focus:bg-tabs-hover`]: !isActive,
  });

  return (
    <div className={classesBox}>
      <button type="button" className={classesButton} onClick={() => handler()}>
        {text}
      </button>
    </div>
  );
};

export function Tabs({ tabs, activeId, block = false }: TextTabsProps) {
  return (
    <div
      className={classnames('', {
        [`flex`]: !block,
      })}
    >
      <div
        className="rounded-[6px] bg-tabs-bg text-tabs-light px-[1.5px]
        select-none overflow-hidden"
      >
        <div className={classnames(`h-10.5 relative grid grid-cols-[repeat(3,_minmax(max-content,_1fr))]`, {})}>
          <Glider id={activeId} size={tabs.length} />
          {tabs?.map((tab, tabIndex) => {
            return <Title key={tabIndex} text={tab.title} activeId={activeId} titleId={`${tabIndex}`} handler={tab.onClick} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Tabs;
