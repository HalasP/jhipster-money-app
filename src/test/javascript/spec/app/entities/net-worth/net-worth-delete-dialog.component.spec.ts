/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { NetWorthDeleteDialogComponent } from 'app/entities/net-worth/net-worth-delete-dialog.component';
import { NetWorthService } from 'app/entities/net-worth/net-worth.service';

describe('Component Tests', () => {
  describe('NetWorth Management Delete Component', () => {
    let comp: NetWorthDeleteDialogComponent;
    let fixture: ComponentFixture<NetWorthDeleteDialogComponent>;
    let service: NetWorthService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [NetWorthDeleteDialogComponent]
      })
        .overrideTemplate(NetWorthDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(NetWorthDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(NetWorthService);
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
