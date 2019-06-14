import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { INetWorth } from 'app/shared/model/net-worth.model';

type EntityResponseType = HttpResponse<INetWorth>;
type EntityArrayResponseType = HttpResponse<INetWorth[]>;

@Injectable({ providedIn: 'root' })
export class NetWorthService {
  public resourceUrl = SERVER_API_URL + 'api/net-worths';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/net-worths';

  constructor(protected http: HttpClient) {}

  create(netWorth: INetWorth): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(netWorth);
    return this.http
      .post<INetWorth>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(netWorth: INetWorth): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(netWorth);
    return this.http
      .put<INetWorth>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INetWorth>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INetWorth[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INetWorth[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(netWorth: INetWorth): INetWorth {
    const copy: INetWorth = Object.assign({}, netWorth, {
      date: netWorth.date != null && netWorth.date.isValid() ? netWorth.date.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date != null ? moment(res.body.date) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((netWorth: INetWorth) => {
        netWorth.date = netWorth.date != null ? moment(netWorth.date) : null;
      });
    }
    return res;
  }
}
