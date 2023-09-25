import React, { useId } from 'react';
import { useOnlineContext } from '../../../hooks/useOnlineStatus';
import classnames from 'classnames';
import AvatarImage from '../../../assets/img/pexels-linkedin-sales-navigator-2182970@2x.png';
import HeaderBackground from '../../../assets/img/header-bg@1x.png';
import IconArrowLeft from '../../../assets/icons/18x18/arrow-left.svg';
import Collapsed from '../../../assets/icons/18x18/dots-three-vertical.svg';
import { LoginButton } from '../../atoms/Button/LoginButton';
import { RoundButton } from '../../atoms/Button/RoundButton';
import Logo from '../../../assets/brand/fmg-logo.svg';
import { ButtonsAcquisition, ButtonsNewApplication, MobileButtons, OnlineStatusButton } from './HeaderButtons';
import InlineButton from '../../atoms/Button/InlineButton';

export enum HeaderType {
  acquisition = 'acquisition',
  newApplication = 'newApplication',
}

export type HeaderProps = {
  headerType: keyof typeof HeaderType;
  accountName: string;
  primaryContact: string;
  returnHome?: () => void;
};

export function Header({ headerType, accountName, primaryContact, returnHome }: HeaderProps) {
  const isOnline = useOnlineContext();
  const componentId = useId();

  const isAcquisition = headerType === HeaderType.acquisition;
  const isNewApplication = headerType === HeaderType.newApplication;

  return (
    <>
      <div
        id={componentId}
        data-testid={`header-${headerType}`}
        className={classnames(
          `pr-4.5 bg-fmg-green bg-header-mobile md:bg-header-desktop z-0 flex max-h-[72px] min-h-[72px] items-center justify-between bg-no-repeat py-3`,
          {
            'pl-4.5': isNewApplication,
            'pl-7.5': isAcquisition,
          }
        )}
        style={{
          // TODO: use this for next and storybook compatibility for now, fix when upgrade to sb 7
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          backgroundImage: `url(${HeaderBackground.src ?? '/' + HeaderBackground})`,
        }}
      >
        <Logo data-testid="logo" width="82px" height="24px" className={classnames({ hidden: isNewApplication, flex: isAcquisition })} />
        <div data-testid="header-back-button" className={classnames('flex items-center', { hidden: isAcquisition })}>
          <div className="hidden md:block">
            <RoundButton aria-label="Back Button" startIcon={<IconArrowLeft />} onClick={returnHome} />
          </div>
          <div className="md:hidden">
            <MobileButtons />
          </div>
        </div>
        <div className="md:ml-4.5 ml-3 flex-1 overflow-hidden text-white">
          {isNewApplication && (
            <>
              <p data-testid="header-account-name" className="truncate text-base font-medium leading-tight tracking-[-.02px] md:text-xl">
                {accountName}
              </p>
              <p data-testid="header-primary-contact" className="truncate text-base leading-tight opacity-75">
                {primaryContact}
              </p>
            </>
          )}
        </div>
        <OnlineStatusButton data-testid="header-online-status-icon" isOnline={isOnline} className={classnames('ml-4.5 hidden md:flex')} />
        {isAcquisition && (
          <div data-testid="header-acquisition-buttons" className="hidden items-center md:flex">
            <ButtonsAcquisition />
          </div>
        )}
        {isNewApplication && (
          <div data-testid="header-new-application-buttons" className="hidden items-center md:flex">
            <ButtonsNewApplication />
          </div>
        )}
        <LoginButton
          data-testid="header-login-button"
          className={classnames('ml-7.5 hidden md:flex')}
          aria-label="Login"
          // TODO: use this for next and storybook compatibility for now, fix when upgrade to sb 7
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          imageUrl={AvatarImage.src ?? '/' + AvatarImage}
        />
        <div data-testid="header-mobile-icons" className="ml-3 flex items-center gap-1.5 md:hidden">
          <OnlineStatusButton data-testid="online-status-mobile" isOnline={isOnline} isMobile />
          <InlineButton startIcon={<Collapsed className={classnames('fill-white')} />} aria-label="Expand menu" color="secondary" />
        </div>
      </div>

      {!isOnline && (
        <div data-testid="header-offline-message" className="bg-warning-light z-10 h-6 py-1 text-center text-xs text-white">
          No internet connection. Online features unavailable.
        </div>
      )}
    </>
  );
}
