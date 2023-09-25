import { useReducer } from 'react';

type PureFunction = () => void;

type Action = {
  type: 'open' | 'close' | 'toggle';
  callback: PureFunction;
};

type NavCtx = {
  onConfirm: PureFunction;
  shouldConfirm: boolean;
};

export type UseConfirmationReducerProps = Required<NavCtx> & {
  openConfirmation: (callback: PureFunction) => void;
  toggleConfirmation: PureFunction;
  closeConfirmation: PureFunction;
};

export function useConfirmationReducer(): UseConfirmationReducerProps {
  const reducer = (navCtx: NavCtx, action: Action) => {
    switch (action.type) {
      case 'open': {
        return { ...navCtx, shouldConfirm: true, onConfirm: action.callback };
      }
      case 'toggle': {
        return { ...navCtx, shouldConfirm: !navCtx.shouldConfirm };
      }
      case 'close':
      default: {
        return { ...navCtx, shouldConfirm: false };
      }
    }
  };

  const defaultCallback = () => {
    return;
  };

  const [navCtx, dispatch] = useReducer(reducer, {
    shouldConfirm: false,
    onConfirm: defaultCallback,
  });

  const openConfirmation = (callback: PureFunction) => {
    dispatch({ type: 'open', callback });
  };

  const toggleConfirmation = () => {
    dispatch({ type: 'toggle', callback: defaultCallback });
  };

  const closeConfirmation = () => {
    dispatch({ type: 'close', callback: defaultCallback });
  };

  return {
    ...navCtx,
    openConfirmation,
    toggleConfirmation,
    closeConfirmation,
  };
}
