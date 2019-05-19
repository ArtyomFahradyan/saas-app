import {Attachment} from './attachment';

export interface Admin {
  account: {
    attachments: Array<Attachment>,
    _id: string,
    reminder: number,
    fiscalYearStartAt: number
  };
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}
