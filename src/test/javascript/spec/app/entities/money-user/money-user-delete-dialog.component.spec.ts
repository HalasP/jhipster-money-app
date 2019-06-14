/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { MoneyUserDeleteDialogComponent } from 'app/entities/money-user/money-user-delete-dialog.component';
import { MoneyUserService } from 'app/entities/money-user/money-user.service';

describe('Component Tests', () => {
  describe('MoneyUser Management Delete Component', () => {
    let comp: MoneyUserDeleteDialogComponent;
    let fixture: ComponentFixture<MoneyUserDeleteDialogComponent>;
    let service: MoneyUserService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [MoneyUserDeleteDialogComponent]
      })
        .overrideTemplate(MoneyUserDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MoneyUserDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MoneyUserService);
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
