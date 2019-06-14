import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAsset } from 'app/shared/model/asset.model';
import { AccountService } from 'app/core';
import { AssetService } from './asset.service';

@Component({
  selector: 'jhi-asset',
  templateUrl: './asset.component.html'
})
export class AssetComponent implements OnInit, OnDestroy {
  assets: IAsset[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected assetService: AssetService,
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
      this.assetService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<IAsset[]>) => res.ok),
          map((res: HttpResponse<IAsset[]>) => res.body)
        )
        .subscribe((res: IAsset[]) => (this.assets = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.assetService
      .query()
      .pipe(
        filter((res: HttpResponse<IAsset[]>) => res.ok),
        map((res: HttpResponse<IAsset[]>) => res.body)
      )
      .subscribe(
        (res: IAsset[]) => {
          this.assets = res;
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
    this.registerChangeInAssets();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IAsset) {
    return item.id;
  }

  registerChangeInAssets() {
    this.eventSubscriber = this.eventManager.subscribe('assetListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
