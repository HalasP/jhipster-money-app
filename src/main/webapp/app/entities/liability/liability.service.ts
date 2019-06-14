import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILiability } from 'app/shared/model/liability.model';

type EntityResponseType = HttpResponse<ILiability>;
type EntityArrayResponseType = HttpResponse<ILiability[]>;

@Injectable({ providedIn: 'root' })
export class LiabilityService {
  public resourceUrl = SERVER_API_URL + 'api/liabilities';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/liabilities';

  constructor(protected http: HttpClient) {}

  create(liability: ILiability): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(liability);
    return this.http
      .post<ILiability>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(liability: ILiability): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(liability);
    return this.http
      .put<ILiability>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILiability>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILiability[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILiability[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(liability: ILiability): ILiability {
    const copy: ILiability = Object.assign({}, liability, {
      date: liability.date != null && liability.date.isValid() ? liability.date.format(DATE_FORMAT) : null
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
      res.body.forEach((liability: ILiability) => {
        liability.date = liability.date != null ? moment(liability.date) : null;
      });
    }
    return res;
  }
}
