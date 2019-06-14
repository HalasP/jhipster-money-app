/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { LiabilityDeleteDialogComponent } from 'app/entities/liability/liability-delete-dialog.component';
import { LiabilityService } from 'app/entities/liability/liability.service';

describe('Component Tests', () => {
  describe('Liability Management Delete Component', () => {
    let comp: LiabilityDeleteDialogComponent;
    let fixture: ComponentFixture<LiabilityDeleteDialogComponent>;
    let service: LiabilityService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [LiabilityDeleteDialogComponent]
      })
        .overrideTemplate(LiabilityDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LiabilityDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LiabilityService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
