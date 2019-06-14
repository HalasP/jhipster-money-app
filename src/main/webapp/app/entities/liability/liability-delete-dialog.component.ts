import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILiability } from 'app/shared/model/liability.model';
import { LiabilityService } from './liability.service';

@Component({
  selector: 'jhi-liability-delete-dialog',
  templateUrl: './liability-delete-dialog.component.html'
})
export class LiabilityDeleteDialogComponent {
  liability: ILiability;

  constructor(protected liabilityService: LiabilityService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.liabilityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'liabilityListModification',
        content: 'Deleted an liability'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-liability-delete-popup',
  template: ''
})
export class LiabilityDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ liability }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(LiabilityDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.liability = liability;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/liability', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/liability', { outlets: { popup: null } }]);
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
