import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMoneyUser } from 'app/shared/model/money-user.model';
import { AccountService } from 'app/core';
import { MoneyUserService } from './money-user.service';

@Component({
  selector: 'jhi-money-user',
  templateUrl: './money-user.component.html'
})
export class MoneyUserComponent implements OnInit, OnDestroy {
  moneyUsers: IMoneyUser[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected moneyUserService: MoneyUserService,
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
      this.moneyUserService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<IMoneyUser[]>) => res.ok),
          map((res: HttpResponse<IMoneyUser[]>) => res.body)
        )
        .subscribe((res: IMoneyUser[]) => (this.moneyUsers = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.moneyUserService
      .query()
      .pipe(
        filter((res: HttpResponse<IMoneyUser[]>) => res.ok),
        map((res: HttpResponse<IMoneyUser[]>) => res.body)
      )
      .subscribe(
        (res: IMoneyUser[]) => {
          this.moneyUsers = res;
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
    this.registerChangeInMoneyUsers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IMoneyUser) {
    return item.id;
  }

  registerChangeInMoneyUsers() {
    this.eventSubscriber = this.eventManager.subscribe('moneyUserListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
