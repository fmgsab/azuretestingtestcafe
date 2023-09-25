import React, { useEffect } from 'react';
import { ModalProps } from '../overlay-types';
import Button from '../../atoms/Button/Button';
import { Modal as DaisyModal } from 'react-daisyui';

export function Modal({
  heading,
  description,
  isOpen = false,
  isMainButtonError = false,
  mainButtonLabel,
  mainButtonOnClick,
  hasSecondaryButton,
  secondaryButtonLabel,
  secondaryButtonOnClick = () => console.log('No event attached to ' + secondaryButtonLabel + ' button'),
  hasCloseOnBackgroundClick = false,
  toggleVisible,
  ...props
}: ModalProps) {
  const tryToggleVisible = () => {
    if (hasCloseOnBackgroundClick) {
      toggleVisible();
    }
  };

  const mainButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    toggleVisible();
    mainButtonOnClick(event);
  };

  const secondaryButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    toggleVisible();
    secondaryButtonOnClick(event);
  };

  //Hide scroll bars when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  return (
    <div>
      <DaisyModal {...props} className="w-96.5 rounded-md p-9" open={isOpen} onClickBackdrop={tryToggleVisible}>
        <DaisyModal.Header className="text-text mb-0 text-center text-xl font-bold">{heading}</DaisyModal.Header>
        <DaisyModal.Body className="test-base pt-4.5 text-text pb-9 text-center">{description}</DaisyModal.Body>
        <DaisyModal.Actions className="modal-action mt-0 justify-center">
          {hasSecondaryButton ? (
            <div className="w-81 flex-initial">
              <Button aria-label="secondary modal" onClick={secondaryButtonClick} color="secondary" block={true}>
                {secondaryButtonLabel}
              </Button>
            </div>
          ) : (
            ''
          )}
          {
            <div className="w-81 flex-initial">
              <Button aria-label="main modal" onClick={mainButtonClick} color="primary" error={isMainButtonError} block={true}>
                {mainButtonLabel}
              </Button>
            </div>
          }
        </DaisyModal.Actions>
      </DaisyModal>
    </div>
  );
}
