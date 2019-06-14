import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INetWorth } from 'app/shared/model/net-worth.model';

@Component({
  selector: 'jhi-net-worth-detail',
  templateUrl: './net-worth-detail.component.html'
})
export class NetWorthDetailComponent implements OnInit {
  netWorth: INetWorth;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ netWorth }) => {
      this.netWorth = netWorth;
    });
  }

  previousState() {
    window.history.back();
  }
}
