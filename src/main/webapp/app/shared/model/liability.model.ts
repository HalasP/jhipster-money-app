import { Moment } from 'moment';

export interface ILiability {
  id?: number;
  date?: Moment;
  name?: string;
  description?: string;
  amount?: number;
}

export class Liability implements ILiability {
  constructor(
    public id?: number,
    public date?: Moment,
    public name?: string,
    public description?: string,
    public amount?: number
  ) {}
}
