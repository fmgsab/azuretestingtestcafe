import { useReducer } from 'react';
import { SectionItemGroupType, SectionItemType } from '../../../db/section-types';

export type Action = {
  type: 'toggle' | 'activate' | 'deactivate' | 'sync';
  expand?: boolean;
  sections?: SectionItemType[];
  hasStarted?: boolean;
  hasCompleted?: boolean;
};

export function useSectionGroupReducer(sections: SectionItemType[]) {
  const [group, dispatch] = useReducer(reducer, { sections });
  const toggle = (expand: boolean) => {
    dispatch({
      type: 'toggle',
      expand,
    });
  };

  const activate = () => {
    dispatch({ type: 'activate' });
  };

  const deactivate = () => {
    dispatch({ type: 'deactivate' });
  };

  const sync = () => {
    dispatch({ type: 'sync', sections });
  };

  return {
    ...group,
    toggle,
    activate,
    deactivate,
    sync,
  };
}

function reducer(group: Partial<SectionItemGroupType>, action: Action) {
  switch (action.type) {
    case 'toggle': {
      return {
        ...group,
        isExpanded: action.expand,
      };
    }

    case 'activate': {
      return {
        ...group,
        isActive: true,
      };
    }

    case 'deactivate': {
      return {
        ...group,
        isActive: false,
      };
    }
    case 'sync':
    default: {
      return {
        ...group,
        sections: action.sections,
      };
    }
  }
}
