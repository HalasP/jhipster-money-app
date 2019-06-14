import { Moment } from 'moment';
import { IMoneyUser } from 'app/shared/model/money-user.model';

export interface IAsset {
  id?: number;
  date?: Moment;
  name?: string;
  description?: string;
  amount?: number;
  moneyUser?: IMoneyUser;
}

export class Asset implements IAsset {
  constructor(
    public id?: number,
    public date?: Moment,
    public name?: string,
    public description?: string,
    public amount?: number,
    public moneyUser?: IMoneyUser
  ) {}
}
