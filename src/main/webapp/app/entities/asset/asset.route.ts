import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Asset } from 'app/shared/model/asset.model';
import { AssetService } from './asset.service';
import { AssetComponent } from './asset.component';
import { AssetDetailComponent } from './asset-detail.component';
import { AssetUpdateComponent } from './asset-update.component';
import { AssetDeletePopupComponent } from './asset-delete-dialog.component';
import { IAsset } from 'app/shared/model/asset.model';

@Injectable({ providedIn: 'root' })
export class AssetResolve implements Resolve<IAsset> {
  constructor(private service: AssetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAsset> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Asset>) => response.ok),
        map((asset: HttpResponse<Asset>) => asset.body)
      );
    }
    return of(new Asset());
  }
}

export const assetRoute: Routes = [
  {
    path: '',
    component: AssetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.asset.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: AssetDetailComponent,
    resolve: {
      asset: AssetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.asset.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: AssetUpdateComponent,
    resolve: {
      asset: AssetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.asset.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: AssetUpdateComponent,
    resolve: {
      asset: AssetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.asset.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const assetPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: AssetDeletePopupComponent,
    resolve: {
      asset: AssetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'jhipsterMoneyApp.asset.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
