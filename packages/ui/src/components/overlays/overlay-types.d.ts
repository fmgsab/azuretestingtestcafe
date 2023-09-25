import React from 'react';

export type ModalProps = {
  isMainButtonError?: boolean;
  mainButtonLabel: string;
  mainButtonOnClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  description?: string;
  heading: string;
  isOpen?: boolean;
  hasSecondaryButton?: boolean;
  secondaryButtonLabel?: string;
  secondaryButtonOnClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hasCloseOnBackgroundClick?: boolean;
  toggleVisible: () => void;
};
