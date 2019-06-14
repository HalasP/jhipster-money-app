import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IMoneyUser, MoneyUser } from 'app/shared/model/money-user.model';
import { MoneyUserService } from './money-user.service';
import { IUser, UserService } from 'app/core';

@Component({
  selector: 'jhi-money-user-update',
  templateUrl: './money-user-update.component.html'
})
export class MoneyUserUpdateComponent implements OnInit {
  isSaving: boolean;

  users: IUser[];

  editForm = this.fb.group({
    id: [],
    owner: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected moneyUserService: MoneyUserService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ moneyUser }) => {
      this.updateForm(moneyUser);
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(moneyUser: IMoneyUser) {
    this.editForm.patchValue({
      id: moneyUser.id,
      owner: moneyUser.owner
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const moneyUser = this.createFromForm();
    if (moneyUser.id !== undefined) {
      this.subscribeToSaveResponse(this.moneyUserService.update(moneyUser));
    } else {
      this.subscribeToSaveResponse(this.moneyUserService.create(moneyUser));
    }
  }

  private createFromForm(): IMoneyUser {
    const entity = {
      ...new MoneyUser(),
      id: this.editForm.get(['id']).value,
      owner: this.editForm.get(['owner']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMoneyUser>>) {
    result.subscribe((res: HttpResponse<IMoneyUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackUserById(index: number, item: IUser) {
    return item.id;
  }
}
