import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Liability } from 'app/shared/model/liability.model';
import { LiabilityService } from './liability.service';
import { LiabilityComponent } from './liability.component';
import { LiabilityDetailComponent } from './liability-detail.component';
import { LiabilityUpdateComponent } from './liability-update.component';
import { LiabilityDeletePopupComponent } from './liability-delete-dialog.component';
import { ILiability } from 'app/shared/model/liability.model';

@Injectable({ providedIn: 'root' })
export class LiabilityResolve implements Resolve<ILiability> {
  constructor(private service: LiabilityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ILiability> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Liability>) => response.ok),
        map((liability: HttpResponse<Liability>) => liability.body)
      );
    }
    return of(new Liability());
  }
}

export const liabilityRoute: Routes = [
  {
    path: '',
    component: LiabilityComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.liability.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: LiabilityDetailComponent,
    resolve: {
      liability: LiabilityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.liability.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: LiabilityUpdateComponent,
    resolve: {
      liability: LiabilityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.liability.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: LiabilityUpdateComponent,
    resolve: {
      liability: LiabilityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.liability.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const liabilityPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: LiabilityDeletePopupComponent,
    resolve: {
      liability: LiabilityResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.liability.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
