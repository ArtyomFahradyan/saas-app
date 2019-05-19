export interface Contract {
  account: string;
  attachment: string;
  createdAt: string;
  customField: object;
  endedAt: string;
  freeEmailsSentCount: number;
  freeProjectsCount: number;
  freeSupportTier: number;
  freeUsersCount: number;
  isDeleted: boolean;
  notes: string;
  paymentFrequency: string;
  paymentTerms: number;
  paidEmailsSentCount: number;
  paidProjectsCount: number;
  paidSupportTier: number;
  paidUsersCount: number;
  platform: {
    name: string,
    _id: string,
  };
  price: number;
  renewalAt: string;
  startedAt: string;
  team: {
    name: string,
    _id: string,
  };
  trialPeriod: number;
  updatedAt: string;
  _id: string;
}
