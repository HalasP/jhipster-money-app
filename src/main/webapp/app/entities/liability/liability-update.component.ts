import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { ILiability, Liability } from 'app/shared/model/liability.model';
import { LiabilityService } from './liability.service';
import { IMoneyUser } from 'app/shared/model/money-user.model';
import { MoneyUserService } from 'app/entities/money-user';

@Component({
  selector: 'jhi-liability-update',
  templateUrl: './liability-update.component.html'
})
export class LiabilityUpdateComponent implements OnInit {
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
    protected liabilityService: LiabilityService,
    protected moneyUserService: MoneyUserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ liability }) => {
      this.updateForm(liability);
    });
    this.moneyUserService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IMoneyUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IMoneyUser[]>) => response.body)
      )
      .subscribe((res: IMoneyUser[]) => (this.moneyusers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(liability: ILiability) {
    this.editForm.patchValue({
      id: liability.id,
      date: liability.date,
      name: liability.name,
      description: liability.description,
      amount: liability.amount,
      moneyUser: liability.moneyUser
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const liability = this.createFromForm();
    if (liability.id !== undefined) {
      this.subscribeToSaveResponse(this.liabilityService.update(liability));
    } else {
      this.subscribeToSaveResponse(this.liabilityService.create(liability));
    }
  }

  private createFromForm(): ILiability {
    const entity = {
      ...new Liability(),
      id: this.editForm.get(['id']).value,
      date: this.editForm.get(['date']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value,
      amount: this.editForm.get(['amount']).value,
      moneyUser: this.editForm.get(['moneyUser']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILiability>>) {
    result.subscribe((res: HttpResponse<ILiability>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
