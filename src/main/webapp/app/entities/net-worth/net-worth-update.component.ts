import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { INetWorth, NetWorth } from 'app/shared/model/net-worth.model';
import { NetWorthService } from './net-worth.service';
import { IMoneyUser } from 'app/shared/model/money-user.model';
import { MoneyUserService } from 'app/entities/money-user';

@Component({
  selector: 'jhi-net-worth-update',
  templateUrl: './net-worth-update.component.html'
})
export class NetWorthUpdateComponent implements OnInit {
  isSaving: boolean;

  moneyusers: IMoneyUser[];
  dateDp: any;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    liabilitiesAmount: [null, [Validators.required]],
    assetsAmount: [null, [Validators.required]],
    moneyUser: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected netWorthService: NetWorthService,
    protected moneyUserService: MoneyUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ netWorth }) => {
      this.updateForm(netWorth);
    });
    this.moneyUserService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IMoneyUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IMoneyUser[]>) => response.body)
      )
      .subscribe((res: IMoneyUser[]) => (this.moneyusers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(netWorth: INetWorth) {
    this.editForm.patchValue({
      id: netWorth.id,
      date: netWorth.date,
      liabilitiesAmount: netWorth.liabilitiesAmount,
      assetsAmount: netWorth.assetsAmount,
      moneyUser: netWorth.moneyUser
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const netWorth = this.createFromForm();
    if (netWorth.id !== undefined) {
      this.subscribeToSaveResponse(this.netWorthService.update(netWorth));
    } else {
      this.subscribeToSaveResponse(this.netWorthService.create(netWorth));
    }
  }

  private createFromForm(): INetWorth {
    const entity = {
      ...new NetWorth(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value,
      liabilitiesAmount: this.editForm.get(['liabilitiesAmount']).value,
      assetsAmount: this.editForm.get(['assetsAmount']).value,
      moneyUser: this.editForm.get(['moneyUser']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INetWorth>>) {
    result.subscribe((res: HttpResponse<INetWorth>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackMoneyUserById(index: number, item: IMoneyUser) {
    return item.id;
  }
}
