import { Moment } from 'moment';
import { IMoneyUser } from 'app/shared/model/money-user.model';

export interface INetWorth {
  id?: number;
  date?: Moment;
  liabilitiesAmount?: number;
  assetsAmount?: number;
  moneyUser?: IMoneyUser;
}

export class NetWorth implements INetWorth {
  constructor(
    public id?: number,
    public date?: Moment,
    public liabilitiesAmount?: number,
    public assetsAmount?: number,
    public moneyUser?: IMoneyUser
  ) {}
}
