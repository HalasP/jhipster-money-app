import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ILiability } from 'app/shared/model/liability.model';
import { AccountService } from 'app/core';
import { LiabilityService } from './liability.service';

@Component({
  selector: 'jhi-liability',
  templateUrl: './liability.component.html'
})
export class LiabilityComponent implements OnInit, OnDestroy {
  liabilities: ILiability[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected liabilityService: LiabilityService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.liabilityService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ILiability[]>) => res.ok),
          map((res: HttpResponse<ILiability[]>) => res.body)
        )
        .subscribe((res: ILiability[]) => (this.liabilities = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.liabilityService
      .query()
      .pipe(
        filter((res: HttpResponse<ILiability[]>) => res.ok),
        map((res: HttpResponse<ILiability[]>) => res.body)
      )
      .subscribe(
        (res: ILiability[]) => {
          this.liabilities = res;
          this.currentSearch = '';
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInLiabilities();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILiability) {
    return item.id;
  }

  registerChangeInLiabilities() {
    this.eventSubscriber = this.eventManager.subscribe('liabilityListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
