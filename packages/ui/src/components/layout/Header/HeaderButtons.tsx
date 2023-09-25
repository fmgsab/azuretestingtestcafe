import InlineButton from '../../atoms/Button/InlineButton';
import IconDuplicate from '../../../assets/icons/18x18/duplicate.svg';
import IconSync from '../../../assets/icons/18x18/sync.svg';
import IconExport from '../../../assets/icons/18x18/upload.svg';
import IconSave from '../../../assets/icons/18x18/save.svg';
import IconNewApplication from '../../../assets/icons/18x18/new-application.svg';
import IconNewReferral from '../../../assets/icons/18x18/new-referral.svg';
import IconHamburger from '../../../assets/icons/18x18/hamburger.svg';
import IconOnline from '../../../assets/icons/24x24/online.svg';
import IconOffline from '../../../assets/icons/24x24/offline.svg';
import classnames from 'classnames';

export const ButtonsNewApplication = () => (
  <>
    <InlineButton startIcon={<IconDuplicate />} aria-label="Duplicate" color="secondary">
      Duplicate
    </InlineButton>
    <InlineButton startIcon={<IconExport />} aria-label="Export" color="secondary">
      Export
    </InlineButton>
    <InlineButton startIcon={<IconSync />} aria-label="Sync" color="secondary">
      Sync
    </InlineButton>
    <InlineButton startIcon={<IconSave />} aria-label="Save" color="secondary">
      Save
    </InlineButton>
  </>
);

export const ButtonsAcquisition = () => (
  <>
    <InlineButton startIcon={<IconNewApplication />} aria-label="New application" color="secondary">
      New Application
    </InlineButton>
    <InlineButton startIcon={<IconNewReferral />} aria-label="New referral" color="secondary">
      New Referral
    </InlineButton>
  </>
);

export const MobileButtons = ({ className }: { className?: string }) => {
  return (
    <span>
      <InlineButton color="secondary" aria-label="online status" startIcon={<IconHamburger />} className={className} />
    </span>
  );
};

export const OnlineStatusButton = ({
  isMobile = false,
  isOnline,
  className,
}: {
  isMobile?: boolean;
  isOnline?: boolean;
  className?: string;
}) => (
  <InlineButton
    className={classnames(`!cursor-default !bg-[#379F1A] ${className}`, { '!mr-7.5': !isMobile })}
    color="secondary"
    aria-label="online status"
    startIcon={isOnline ? <IconOnline /> : <IconOffline />}
  >
    {isMobile ? null : <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>}
  </InlineButton>
);
