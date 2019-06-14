import { INetWorth } from 'app/shared/model/net-worth.model';
import { ILiability } from 'app/shared/model/liability.model';
import { IAsset } from 'app/shared/model/asset.model';
import { IUser } from 'app/core/user/user.model';

export interface IMoneyUser {
  id?: number;
  netWorths?: INetWorth[];
  liabilities?: ILiability[];
  assets?: IAsset[];
  owner?: IUser;
}

export class MoneyUser implements IMoneyUser {
  constructor(
    public id?: number,
    public netWorths?: INetWorth[],
    public liabilities?: ILiability[],
    public assets?: IAsset[],
    public owner?: IUser
  ) {}
}
