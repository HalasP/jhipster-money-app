import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhipsterMoneyAppSharedModule } from 'app/shared';
import {
  NetWorthComponent,
  NetWorthDetailComponent,
  NetWorthUpdateComponent,
  NetWorthDeletePopupComponent,
  NetWorthDeleteDialogComponent,
  netWorthRoute,
  netWorthPopupRoute
} from './';

const ENTITY_STATES = [...netWorthRoute, ...netWorthPopupRoute];

@NgModule({
  imports: [JhipsterMoneyAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    NetWorthComponent,
    NetWorthDetailComponent,
    NetWorthUpdateComponent,
    NetWorthDeleteDialogComponent,
    NetWorthDeletePopupComponent
  ],
  entryComponents: [NetWorthComponent, NetWorthUpdateComponent, NetWorthDeleteDialogComponent, NetWorthDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterMoneyAppNetWorthModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
