import React from 'react';
import classnames from 'classnames';
import { animated, useTransition } from '@react-spring/web';

import Plus from '../../../assets/icons/18x18/plus.svg';
import Remove from '../../../assets/icons/18x18/close.svg';

import { Accordion, AccordionChildProps } from '../../../embellishments/Accordion/Accordion';
import { SectionGroupContext, useSectionGroupContext } from '../context';
import { useSectionTable, useSectionStatus, useSectionGroupReducer, useDisplayStatus } from '../hooks';
import { SectionItem } from '../SectionItem/SectionItem';
import { useSnackbar } from '../../overlays/Snackbar/useSnackbar';
import { SectionItemType, SectionItemGroupType, SectionListsType } from '../../../db/section-types';
import { useNavContext } from '../../../context/NavContext';

export function MultiSection(props: SectionItemGroupType & { sectionLists: SectionListsType }) {
  const { selectedSectionId, setSelectedSectionId } = useSectionStatus();
  const groupTable = useSectionTable(props);
  const groupStatus = useSectionGroupReducer(groupTable.sections);
  const calculateNextDisplayId = useDisplayStatus(props.sectionLists);

  if (!selectedSectionId && groupTable.sections[0]?.id) {
    setSelectedSectionId(groupTable.sections[0].id);
  }

  return (
    <SectionGroupContext.Provider
      value={{
        ...props,
        ...groupStatus,
        ...groupTable,
        calculateNextDisplayId,
      }}
    >
      <Accordion isDefaultOpen={groupStatus.isExpanded} onShow={groupStatus.toggle}>
        <Accordion.Heading className="group focus-visible:outline-0" render={(props) => <GroupParent {...props} />} />
        <Accordion.Content render={() => <GroupChildren />} />
      </Accordion>
    </SectionGroupContext.Provider>
  );
}

export function GroupParent(props: AccordionChildProps) {
  const { open } = useSnackbar('warning', 'Item limit reached');
  const { selectedSectionId } = useSectionStatus();
  const { sections, name, addSection, sync, table, ...ctx } = useSectionGroupContext();

  ctx.hasStarted = sections.length > 0;
  ctx.hasCompleted = ctx.hasStarted && sections.every((section) => section.hasCompleted);
  ctx.hasError = sections.some((section) => section.hasError);
  ctx.isActive =
    ctx.isExpanded ||
    sections.some((section) => {
      const displayId = `${table?.name}_${section?.id}`;
      return displayId === selectedSectionId;
    });

  const handleAdd = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sections.length >= 99) {
      open();
    } else {
      addSection?.(`${name} ${sections.length + 1}`);
      // This is from Accordion not ctx
      props.toggle?.(true);
      sync?.();
    }
  };

  return (
    <SectionItem
      title={<span className={classnames({ 'opacity-50': !ctx.hasStarted })}>{name}</span>}
      isFocusDisabled
      count={sections.length}
      {...ctx}
    >
      <SectionItem.Action
        className="hover:bg-blue-240-active focus-visible:bg-blue-240-active"
        onClick={handleAdd}
        onKeyDown={(e) => e.stopPropagation()}
        title="Add"
      >
        <>
          Add
          <Plus />
        </>
      </SectionItem.Action>
    </SectionItem>
  );
}

export function GroupChildren() {
  const navContext = useNavContext();
  const { selectedSectionId, setSelectedSectionId } = useSectionStatus();
  const { removeSection, sections, placeholder, isExpanded, name, table, calculateNextDisplayId } = useSectionGroupContext();

  const handleOnClick = async (displayId: unknown) => {
    // Do nothing if the click is on the placeholder
    if (sections.length === 0) return;
    // Otherwise set the selected id
    setSelectedSectionId?.(displayId);
  };

  const handleRemove = async (id: unknown) => {
    navContext.openConfirmation(async () => {
      await removeSection?.(id);
      const nextSectionId = calculateNextDisplayId?.(`${id}`, table);
      setSelectedSectionId?.(nextSectionId, true);
    });
  };

  const showPlaceholder = sections.length === 0 && Boolean(placeholder);

  const transitions = useTransition(
    [...(showPlaceholder ? [{ name: placeholder, id: null, isDisabled: true, type: '' }] : sections)].map((data) => ({ ...data })),
    {
      key: (item: SectionItemType) => item.id,
      from: { opacity: 0 },
      leave: { opacity: 0, height: 0, config: { duration: 150 } },
      enter: { opacity: 1 },
    }
  );

  return (
    <ul id={`submenu-${name}`}>
      {transitions((style, section) => {
        const displayId = `${table?.name}_${section?.id}`;
        const isActive = selectedSectionId === displayId;
        return (
          <animated.li className="border-multi-value ml-5 select-none border-l-2 pl-2" style={style}>
            <SectionItem
              {...section}
              title={`${section.name ?? ''}`}
              isActive={isActive}
              isFocusDisabled={!isExpanded}
              onClick={() => handleOnClick(displayId)}
            >
              <SectionItem.Action
                className="hover:bg-blue-240-hover-10 focus-visible:bg-blue-240-hover-10"
                onClick={() => handleRemove(section.id)}
                title="Remove"
              >
                <Remove />
              </SectionItem.Action>
            </SectionItem>
          </animated.li>
        );
      })}
    </ul>
  );
}
