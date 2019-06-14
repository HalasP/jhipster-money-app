import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMoneyUser } from 'app/shared/model/money-user.model';

type EntityResponseType = HttpResponse<IMoneyUser>;
type EntityArrayResponseType = HttpResponse<IMoneyUser[]>;

@Injectable({ providedIn: 'root' })
export class MoneyUserService {
  public resourceUrl = SERVER_API_URL + 'api/money-users';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/money-users';

  constructor(protected http: HttpClient) {}

  create(moneyUser: IMoneyUser): Observable<EntityResponseType> {
    return this.http.post<IMoneyUser>(this.resourceUrl, moneyUser, { observe: 'response' });
  }

  update(moneyUser: IMoneyUser): Observable<EntityResponseType> {
    return this.http.put<IMoneyUser>(this.resourceUrl, moneyUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMoneyUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMoneyUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMoneyUser[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
