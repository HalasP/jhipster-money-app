import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMoneyUser } from 'app/shared/model/money-user.model';
import { MoneyUserService } from './money-user.service';

@Component({
  selector: 'jhi-money-user-delete-dialog',
  templateUrl: './money-user-delete-dialog.component.html'
})
export class MoneyUserDeleteDialogComponent {
  moneyUser: IMoneyUser;

  constructor(protected moneyUserService: MoneyUserService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.moneyUserService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'moneyUserListModification',
        content: 'Deleted an moneyUser'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-money-user-delete-popup',
  template: ''
})
export class MoneyUserDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ moneyUser }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(MoneyUserDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.moneyUser = moneyUser;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/money-user', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/money-user', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
