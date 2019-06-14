import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IAsset, Asset } from 'app/shared/model/asset.model';
import { AssetService } from './asset.service';
import { IMoneyUser } from 'app/shared/model/money-user.model';
import { MoneyUserService } from 'app/entities/money-user';

@Component({
  selector: 'jhi-asset-update',
  templateUrl: './asset-update.component.html'
})
export class AssetUpdateComponent implements OnInit {
  isSaving: boolean;

  moneyusers: IMoneyUser[];
  dateDp: any;

  editForm = this.fb.group({
    id: [],
    date: [null, [Validators.required]],
    name: [null, [Validators.required]],
    description: [],
    amount: [null, [Validators.required]],
    moneyUser: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected assetService: AssetService,
    protected moneyUserService: MoneyUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ asset }) => {
      this.updateForm(asset);
    });
    this.moneyUserService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IMoneyUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IMoneyUser[]>) => response.body)
      )
      .subscribe((res: IMoneyUser[]) => (this.moneyusers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(asset: IAsset) {
    this.editForm.patchValue({
      id: asset.id,
      date: asset.date,
      name: asset.name,
      description: asset.description,
      amount: asset.amount,
      moneyUser: asset.moneyUser
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const asset = this.createFromForm();
    if (asset.id !== undefined) {
      this.subscribeToSaveResponse(this.assetService.update(asset));
    } else {
      this.subscribeToSaveResponse(this.assetService.create(asset));
    }
  }

  private createFromForm(): IAsset {
    const entity = {
      ...new Asset(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value,
      amount: this.editForm.get(['amount']).value,
      moneyUser: this.editForm.get(['moneyUser']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAsset>>) {
    result.subscribe((res: HttpResponse<IAsset>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
