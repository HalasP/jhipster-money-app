import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { INetWorth } from 'app/shared/model/net-worth.model';
import { AccountService } from 'app/core';
import { NetWorthService } from './net-worth.service';

@Component({
  selector: 'jhi-net-worth',
  templateUrl: './net-worth.component.html'
})
export class NetWorthComponent implements OnInit, OnDestroy {
  netWorths: INetWorth[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected netWorthService: NetWorthService,
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
      this.netWorthService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<INetWorth[]>) => res.ok),
          map((res: HttpResponse<INetWorth[]>) => res.body)
        )
        .subscribe((res: INetWorth[]) => (this.netWorths = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.netWorthService
      .query()
      .pipe(
        filter((res: HttpResponse<INetWorth[]>) => res.ok),
        map((res: HttpResponse<INetWorth[]>) => res.body)
      )
      .subscribe(
        (res: INetWorth[]) => {
          this.netWorths = res;
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
    this.registerChangeInNetWorths();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: INetWorth) {
    return item.id;
  }

  registerChangeInNetWorths() {
    this.eventSubscriber = this.eventManager.subscribe('netWorthListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
