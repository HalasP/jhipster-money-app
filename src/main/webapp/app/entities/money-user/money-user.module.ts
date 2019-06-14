import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhipsterMoneyAppSharedModule } from 'app/shared';
import {
  MoneyUserComponent,
  MoneyUserDetailComponent,
  MoneyUserUpdateComponent,
  MoneyUserDeletePopupComponent,
  MoneyUserDeleteDialogComponent,
  moneyUserRoute,
  moneyUserPopupRoute
} from './';

const ENTITY_STATES = [...moneyUserRoute, ...moneyUserPopupRoute];

@NgModule({
  imports: [JhipsterMoneyAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MoneyUserComponent,
    MoneyUserDetailComponent,
    MoneyUserUpdateComponent,
    MoneyUserDeleteDialogComponent,
    MoneyUserDeletePopupComponent
  ],
  entryComponents: [MoneyUserComponent, MoneyUserUpdateComponent, MoneyUserDeleteDialogComponent, MoneyUserDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterMoneyAppMoneyUserModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
