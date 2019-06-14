import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoneyUser } from 'app/shared/model/money-user.model';

@Component({
  selector: 'jhi-money-user-detail',
  templateUrl: './money-user-detail.component.html'
})
export class MoneyUserDetailComponent implements OnInit {
  moneyUser: IMoneyUser;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ moneyUser }) => {
      this.moneyUser = moneyUser;
    });
  }

  previousState() {
    window.history.back();
  }
}
