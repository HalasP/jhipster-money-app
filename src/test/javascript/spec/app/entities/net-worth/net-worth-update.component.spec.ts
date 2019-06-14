/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { NetWorthUpdateComponent } from 'app/entities/net-worth/net-worth-update.component';
import { NetWorthService } from 'app/entities/net-worth/net-worth.service';
import { NetWorth } from 'app/shared/model/net-worth.model';

describe('Component Tests', () => {
  describe('NetWorth Management Update Component', () => {
    let comp: NetWorthUpdateComponent;
    let fixture: ComponentFixture<NetWorthUpdateComponent>;
    let service: NetWorthService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [NetWorthUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(NetWorthUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NetWorthUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(NetWorthService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new NetWorth(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new NetWorth();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
