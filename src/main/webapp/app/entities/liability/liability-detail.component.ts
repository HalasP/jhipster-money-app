import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILiability } from 'app/shared/model/liability.model';

@Component({
  selector: 'jhi-liability-detail',
  templateUrl: './liability-detail.component.html'
})
export class LiabilityDetailComponent implements OnInit {
  liability: ILiability;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ liability }) => {
      this.liability = liability;
    });
  }

  previousState() {
    window.history.back();
  }
}
