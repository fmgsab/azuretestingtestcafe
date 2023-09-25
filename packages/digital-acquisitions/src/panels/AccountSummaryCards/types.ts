import dayjs from 'dayjs';

export type CardData = {
  data: {
    title: string;
    rows: CardRow[];
  };
};

export type CardRow = {
  label?: string | undefined;
  value?: string | undefined;
};

export type CardTitles = {
  accountInformation: string;
  farmAndBusinessInformation: string;
  referrals: string;
};

export type IAccount = {
  accountId: number;
  accountName: string;
  primaryOwnerSalutation?: string;
  primaryOwnerFirstName: string;
  primaryOwnerMiddleName?: string | null;
  primaryOwnerLastName: string;
  preferredName?: string | null;
  inceptionDate?: string;
  farmAndBusinessOperation?: string;
  operations?: string;
  referrals: string[];
  operatingModel?: string;
};

export class AccountSummary {
  constructor(account: IAccount) {
    this.account = account;
  }

  account: IAccount;
  rowLabels: Partial<IAccount> & { fullName: string; referralsLabel: string } = {
    accountName: 'Account Name',
    farmAndBusinessOperation: 'Operations',
    inceptionDate: 'Inception Date',
    operatingModel: 'Operating Model',
    operations: 'Farm and Business Operation',
    preferredName: 'Preferred Name',
    referralsLabel: 'Type',
    fullName: 'Full Name',
    primaryOwnerFirstName: 'Primary Owner First Name',
  };

  cardTitles: CardTitles = {
    accountInformation: 'Account Information',
    farmAndBusinessInformation: 'Farm and Business Information',
    referrals: 'Referrals',
  };

  getAccountInformation() {
    return {
      title: this.cardTitles.accountInformation,
      rows: [
        {
          label: this.rowLabels.accountName,
          value: this.account.accountName,
        },
        {
          label: this.rowLabels.fullName,
          value: `${this.account.primaryOwnerFirstName} ${this.account.primaryOwnerLastName}`,
        },
        {
          label: this.rowLabels.inceptionDate,
          value: dayjs(this.account.inceptionDate).format('DD MMMM YYYY'),
        },
      ],
    };
  }

  getFarmAndBusinessInformation() {
    return {
      title: this.cardTitles.farmAndBusinessInformation,
      rows: [
        {
          label: this.rowLabels.farmAndBusinessOperation,
          value: this.account.farmAndBusinessOperation,
        },
        {
          label: this.rowLabels.operations,
          value: this.account.operations,
        },
        {
          label: this.rowLabels.operatingModel,
          value: this.account.operatingModel,
        },
      ],
    };
  }

  getReferrals() {
    return {
      title: this.cardTitles.referrals,
      rows: this.account.referrals.slice(0, 3).map((referral) => ({
        label: this.rowLabels.referralsLabel,
        value: referral,
      })),
    };
  }
}
