import { Moment } from 'moment';

export interface INetWorth {
  id?: number;
  date?: Moment;
  liabilitiesAmount?: number;
  assetsAmount?: number;
}

export class NetWorth implements INetWorth {
  constructor(
    public id?: number,
    public date?: Moment,
    public liabilitiesAmount?: number,
    public assetsAmount?: number
  ) {}
}
