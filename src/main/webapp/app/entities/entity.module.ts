import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'asset',
        loadChildren: './asset/asset.module#JhipsterMoneyAppAssetModule'
      },
      {
        path: 'liability',
        loadChildren: './liability/liability.module#JhipsterMoneyAppLiabilityModule'
      },
      {
        path: 'net-worth',
        loadChildren: './net-worth/net-worth.module#JhipsterMoneyAppNetWorthModule'
      },
      {
        path: 'money-user',
        loadChildren: './money-user/money-user.module#JhipsterMoneyAppMoneyUserModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterMoneyAppEntityModule {}
