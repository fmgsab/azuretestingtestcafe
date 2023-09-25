import React, { useId } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import classNames from 'classnames';
import CloseImg from '../../../assets/icons/18x18/close.svg';

export function Container() {
  const id = useId();
  return (
    <Toaster
      key={id}
      position="bottom-center"
      reverseOrder={true}
      gutter={6}
      containerStyle={{
        top: 0,
        left: 0,
        bottom: 60,
        right: 0,
      }}
    />
  );
}

export function useSnackbar(color: 'success' | 'warning' | 'error', label: string, duration = 5000) {
  return {
    open: () =>
      toast.custom(
        (t: { visible: boolean; id: string }) => (
          <div
            className={classNames(
              'pointer-events-auto flex w-76 min-w-76 rounded-md shadow-snackbar md:w-141 md:min-w-141 lg:w-150 lg:min-w-150',
              {
                'animate-snackbarIn': t.visible,
                'animate-snackbarOut': !t.visible,
                'bg-primary': color === 'success',
                'bg-warning': color === 'warning',
                'bg-error': color === 'error',
              }
            )}
          >
            <div className="align-text-middle flex-1 truncate py-3.75 pl-4.5">
              <p className="h-4.5 truncate text-base text-white">{label}</p>
            </div>
            <div className="min-h-9.5 flex min-w-13.5 p-1.5 ">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="min-h-9 flex min-w-10.5 items-center justify-center rounded hover:bg-black/15 focus:bg-black/25"
              >
                <CloseImg fill="white" />
              </button>
            </div>
          </div>
        ),
        {
          duration: duration,
        }
      ),
    Container,
  };
}
