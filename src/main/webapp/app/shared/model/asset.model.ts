import { Moment } from 'moment';

export interface IAsset {
  id?: number;
  date?: Moment;
  name?: string;
  description?: string;
  amount?: number;
}

export class Asset implements IAsset {
  constructor(
    public id?: number,
    public date?: Moment,
    public name?: string,
    public description?: string,
    public amount?: number
  ) {}
}
