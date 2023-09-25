import React from 'react';

import { Modal } from '../../overlays/Modal/Modal';
import { useNavContext } from '../../../context/NavContext';

type DeleteConfirmationProps = {
  toggleVisible: () => void;
  isOpen: boolean;
};

export function DeleteConfirmation({ toggleVisible, isOpen }: DeleteConfirmationProps) {
  const navContext = useNavContext();

  const modalProps = {
    heading: 'Delete Item',
    description: 'Are you sure you want to delete this Item? This action cannot be undone.',
    isMainButtonError: true,
    mainButtonLabel: 'Delete',
    hasSecondaryButton: true,
    secondaryButtonLabel: 'Cancel',
    hasCloseOnBackgroundClick: true,
  };

  return (
    <Modal
      {...modalProps}
      isOpen={isOpen}
      toggleVisible={toggleVisible}
      mainButtonOnClick={navContext.onConfirm}
      data-testid="remove-confirmation"
    />
  );
}
