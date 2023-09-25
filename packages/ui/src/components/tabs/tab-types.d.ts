import React from 'react';

export type IdEnum = '0' | '1' | '2';

export type TabsType = {
  onClick: () => void;
  title: string;
};

export type IconTabsType = TabsType & {
  icon: React.ReactNode;
};

export type TabsProps = {
  activeId: IdEnum;
};

export type IconTabsProps = TabsProps & { tabs: IconTabsType[] };

export type TextTabsProps = TabsProps & { tabs: TabsType[]; block?: boolean };
