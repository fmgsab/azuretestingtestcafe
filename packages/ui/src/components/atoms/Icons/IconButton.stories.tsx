import React, { FunctionComponent, SVGAttributes } from 'react';
import { Button as DaisyButton } from 'react-daisyui';
import { Meta, StoryObj } from '@storybook/react';
// 12x12
import ArrowDown12Icon from '../../../assets/icons/12x12/arrow-down.svg';
import ArrowUp12Icon from '../../../assets/icons/12x12/arrow-up.svg';
import CaretDownIcon from '../../../assets/icons/12x12/caret-down.svg';
// 18x18
import ArrowLeftIcon from '../../../assets/icons/18x18/arrow-left.svg';
import ArrowRightIcon from '../../../assets/icons/18x18/arrow-right.svg';
import ArrowDownIcon from '../../../assets/icons/18x18/arrow-down.svg';
import ArrowUpIcon from '../../../assets/icons/18x18/arrow-up.svg';
import BoxIcon from '../../../assets/icons/18x18/box.svg';
import CalendarIcon from '../../../assets/icons/18x18/calendar.svg';
import CalendarChecklessIcon from '../../../assets/icons/18x18/calendar-checkless.svg';
import CaretIcon from '../../../assets/icons/18x18/caret.svg';
import CheckIcon from '../../../assets/icons/18x18/check.svg';
import CheckboxIcon from '../../../assets/icons/18x18/check-box.svg';
import CheckCircleIcon from '../../../assets/icons/18x18/check-circle.svg';
import CircleIcon from '../../../assets/icons/18x18/circle.svg';
import CloseIcon from '../../../assets/icons/18x18/close.svg';
import DateIcon from '../../../assets/icons/18x18/date.svg';
import Dots3VerticalIcon from '../../../assets/icons/18x18/dots-three-vertical.svg';
import DragIcon from '../../../assets/icons/18x18/drag.svg';
import DuplicateIcon from '../../../assets/icons/18x18/duplicate.svg';
import EmailIcon from '../../../assets/icons/18x18/email.svg';
import File18Icon from '../../../assets/icons/18x18/file.svg';
import GridIcon from '../../../assets/icons/18x18/grid.svg';
import HalfCircleIcon from '../../../assets/icons/18x18/half-circle.svg';
import InfoIcon from '../../../assets/icons/18x18/info.svg';
import InvalidIcon from '../../../assets/icons/18x18/invalid.svg';
import HamburgerIcon from '../../../assets/icons/18x18/hamburger.svg';
import HouseIcon from '../../../assets/icons/18x18/house.svg';
import LocationIcon from '../../../assets/icons/18x18/location.svg';
import MinusIcon from '../../../assets/icons/18x18/minus.svg';
import MinusCircleIcon from '../../../assets/icons/18x18/minus-circle.svg';
import NewApplicationIcon from '../../../assets/icons/18x18/new-application.svg';
import NewReferralIcon from '../../../assets/icons/18x18/new-referral.svg';
import PhoneIcon from '../../../assets/icons/18x18/phone.svg';
import PlusIcon from '../../../assets/icons/18x18/plus.svg';
import SaveIcon from '../../../assets/icons/18x18/save.svg';
import SearchIcon from '../../../assets/icons/18x18/search.svg';
import StackIcon from '../../../assets/icons/18x18/stack.svg';
import SyncIcon from '../../../assets/icons/18x18/sync.svg';
import TimeIcon from '../../../assets/icons/18x18/time.svg';
import ToggledIcon from '../../../assets/icons/18x18/toggled.svg';
import UncheckedIcon from '../../../assets/icons/18x18/unchecked.svg';
import UploadIcon from '../../../assets/icons/18x18/upload.svg';
import WifiIcon from '../../../assets/icons/18x18/wifi.svg';
// 24x24
import AttachmentIcon from '../../../assets/icons/24x24/attachment.svg';
import CalculatorIcon from '../../../assets/icons/24x24/calculator.svg';
import CameraIcon from '../../../assets/icons/24x24/camera.svg';
import FilesIcon from '../../../assets/icons/24x24/files.svg';
import HomeIcon from '../../../assets/icons/24x24/home.svg';
import NoteIcon from '../../../assets/icons/24x24/note.svg';
import OfflineIcon from '../../../assets/icons/24x24/offline.svg';
import OnlineIcon from '../../../assets/icons/24x24/online.svg';
import PencilIcon from '../../../assets/icons/24x24/pencil.svg';
import SettingsIcon from '../../../assets/icons/24x24/settings.svg';
import UserIcon from '../../../assets/icons/24x24/user.svg';
import UsersIcon from '../../../assets/icons/24x24/users.svg';
// 30x30
import FileIcon from '../../../assets/icons/30x30/file.svg';
// 42x42
import AddCircleIcon from '../../../assets/icons/42x42/add-circle.svg';
import AddFileIcon from '../../../assets/icons/42x42/add-file.svg';
import AddUserIcon from '../../../assets/icons/42x42/add-user.svg';
// misc
import ItemConnectorIcon from '../../../assets/icons/misc/item-connector.svg';
import ItemEndIcon from '../../../assets/icons/misc/item-end.svg';

const icons: [string, FunctionComponent<SVGAttributes<SVGElement>>[]][] = [
  ['12x12', [ArrowDown12Icon, ArrowUp12Icon, CaretDownIcon]],
  [
    '18x18',
    [
      ArrowLeftIcon,
      ArrowRightIcon,
      ArrowDownIcon,
      ArrowUpIcon,
      BoxIcon,
      CalendarIcon,
      CalendarChecklessIcon,
      CaretIcon,
      CheckIcon,
      CheckboxIcon,
      CheckCircleIcon,
      CircleIcon,
      CloseIcon,
      DateIcon,
      Dots3VerticalIcon,
      DragIcon,
      DuplicateIcon,
      EmailIcon,
      File18Icon,
      GridIcon,
      HalfCircleIcon,
      HamburgerIcon,
      HouseIcon,
      InfoIcon,
      InvalidIcon,
      LocationIcon,
      MinusIcon,
      MinusCircleIcon,
      NewApplicationIcon,
      NewReferralIcon,
      PhoneIcon,
      PlusIcon,
      SaveIcon,
      SearchIcon,
      StackIcon,
      SyncIcon,
      TimeIcon,
      ToggledIcon,
      UncheckedIcon,
      UploadIcon,
      WifiIcon,
    ],
  ],
  [
    '24x24',
    [
      AttachmentIcon,
      CalculatorIcon,
      CameraIcon,
      FilesIcon,
      HomeIcon,
      NoteIcon,
      OfflineIcon,
      OnlineIcon,
      PencilIcon,
      SettingsIcon,
      UserIcon,
      UsersIcon,
    ],
  ],
  ['30x30', [FileIcon]],
  ['42x42', [AddCircleIcon, AddFileIcon, AddUserIcon]],
  ['misc', [ItemConnectorIcon, ItemEndIcon]],
];

const meta: Meta = {
  title: 'Atoms/Icons',
  component: DaisyButton,
  parameters: {},
};

export default meta;

export const Template: StoryObj = {
  render: (args) => {
    return (
      <div style={{ display: 'flex' }}>
        {icons.map((iconGroup, groupIdx) => {
          return (
            <div key={groupIdx}>
              <b>{iconGroup[0]}</b>
              {iconGroup[1].map((Icon, lineIdx) => (
                <div key={lineIdx} className="my-2 flex w-full items-center justify-start">
                  <div className="mx-2 w-6">{lineIdx + 1}</div>
                  <DaisyButton {...args} shape="circle" startIcon={<Icon aria-label="svg-icon" />} className="mx-2"></DaisyButton>
                  <DaisyButton {...args} shape="square" startIcon={<Icon aria-label="svg-icon" />} className="mx-2"></DaisyButton>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  },
  args: {},
};

export const Primary: StoryObj = {
  ...Template,
  args: {
    color: 'primary',
  },
};

export const Secondary: StoryObj = {
  ...Template,
  args: {
    color: 'secondary',
  },
};

export const Error: StoryObj = {
  ...Template,
  args: {
    color: 'error',
  },
};

export const Disabled: StoryObj = {
  ...Template,
  args: {
    disabled: true,
  },
};
