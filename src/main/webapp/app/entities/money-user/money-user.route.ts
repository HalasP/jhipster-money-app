import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MoneyUser } from 'app/shared/model/money-user.model';
import { MoneyUserService } from './money-user.service';
import { MoneyUserComponent } from './money-user.component';
import { MoneyUserDetailComponent } from './money-user-detail.component';
import { MoneyUserUpdateComponent } from './money-user-update.component';
import { MoneyUserDeletePopupComponent } from './money-user-delete-dialog.component';
import { IMoneyUser } from 'app/shared/model/money-user.model';

@Injectable({ providedIn: 'root' })
export class MoneyUserResolve implements Resolve<IMoneyUser> {
  constructor(private service: MoneyUserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMoneyUser> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<MoneyUser>) => response.ok),
        map((moneyUser: HttpResponse<MoneyUser>) => moneyUser.body)
      );
    }
    return of(new MoneyUser());
  }
}

export const moneyUserRoute: Routes = [
  {
    path: '',
    component: MoneyUserComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.moneyUser.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: MoneyUserDetailComponent,
    resolve: {
      moneyUser: MoneyUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.moneyUser.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: MoneyUserUpdateComponent,
    resolve: {
      moneyUser: MoneyUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.moneyUser.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: MoneyUserUpdateComponent,
    resolve: {
      moneyUser: MoneyUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.moneyUser.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const moneyUserPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: MoneyUserDeletePopupComponent,
    resolve: {
      moneyUser: MoneyUserResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.moneyUser.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
