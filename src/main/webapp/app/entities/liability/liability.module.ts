import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhipsterMoneyAppSharedModule } from 'app/shared';
import {
  LiabilityComponent,
  LiabilityDetailComponent,
  LiabilityUpdateComponent,
  LiabilityDeletePopupComponent,
  LiabilityDeleteDialogComponent,
  liabilityRoute,
  liabilityPopupRoute
} from './';

const ENTITY_STATES = [...liabilityRoute, ...liabilityPopupRoute];

@NgModule({
  imports: [JhipsterMoneyAppSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LiabilityComponent,
    LiabilityDetailComponent,
    LiabilityUpdateComponent,
    LiabilityDeleteDialogComponent,
    LiabilityDeletePopupComponent
  ],
  entryComponents: [LiabilityComponent, LiabilityUpdateComponent, LiabilityDeleteDialogComponent, LiabilityDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterMoneyAppLiabilityModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
