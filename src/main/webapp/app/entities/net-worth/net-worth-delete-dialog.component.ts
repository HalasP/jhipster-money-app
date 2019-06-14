import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { INetWorth } from 'app/shared/model/net-worth.model';
import { NetWorthService } from './net-worth.service';

@Component({
  selector: 'jhi-net-worth-delete-dialog',
  templateUrl: './net-worth-delete-dialog.component.html'
})
export class NetWorthDeleteDialogComponent {
  netWorth: INetWorth;

  constructor(protected netWorthService: NetWorthService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.netWorthService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'netWorthListModification',
        content: 'Deleted an netWorth'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-net-worth-delete-popup',
  template: ''
})
export class NetWorthDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ netWorth }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(NetWorthDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.netWorth = netWorth;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/net-worth', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/net-worth', { outlets: { popup: null } }]);
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
