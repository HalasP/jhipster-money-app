import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { NetWorth } from 'app/shared/model/net-worth.model';
import { NetWorthService } from './net-worth.service';
import { NetWorthComponent } from './net-worth.component';
import { NetWorthDetailComponent } from './net-worth-detail.component';
import { NetWorthUpdateComponent } from './net-worth-update.component';
import { NetWorthDeletePopupComponent } from './net-worth-delete-dialog.component';
import { INetWorth } from 'app/shared/model/net-worth.model';

@Injectable({ providedIn: 'root' })
export class NetWorthResolve implements Resolve<INetWorth> {
  constructor(private service: NetWorthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<INetWorth> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<NetWorth>) => response.ok),
        map((netWorth: HttpResponse<NetWorth>) => netWorth.body)
      );
    }
    return of(new NetWorth());
  }
}

export const netWorthRoute: Routes = [
  {
    path: '',
    component: NetWorthComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.netWorth.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: NetWorthDetailComponent,
    resolve: {
      netWorth: NetWorthResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.netWorth.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: NetWorthUpdateComponent,
    resolve: {
      netWorth: NetWorthResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.netWorth.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: NetWorthUpdateComponent,
    resolve: {
      netWorth: NetWorthResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.netWorth.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const netWorthPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: NetWorthDeletePopupComponent,
    resolve: {
      netWorth: NetWorthResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.netWorth.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
