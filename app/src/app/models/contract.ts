export interface Contract {
  account: string;
  createdAt: string;
  customField: object;
  endedAt: string;
  freeEmailsSentCount: number;
  freeProjectsCount: number;
  freeSupportTier: number;
  freeUsersCount: number;
  isDeleted: boolean;
  notes: string;
  paidEmailsSentCount: number;
  paidProjectsCount: number;
  paidSupportTier: number;
  paidUsersCount: number;
  platform: object;
  price: number;
  renewalAt: string;
  startedAt: string;
  team: object;
  trialPeriod: number;
  updatedAt: string;
  _id: string;
}
