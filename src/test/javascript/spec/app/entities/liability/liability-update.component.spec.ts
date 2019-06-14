/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { LiabilityUpdateComponent } from 'app/entities/liability/liability-update.component';
import { LiabilityService } from 'app/entities/liability/liability.service';
import { Liability } from 'app/shared/model/liability.model';

describe('Component Tests', () => {
  describe('Liability Management Update Component', () => {
    let comp: LiabilityUpdateComponent;
    let fixture: ComponentFixture<LiabilityUpdateComponent>;
    let service: LiabilityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [LiabilityUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(LiabilityUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LiabilityUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LiabilityService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Liability(123);
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
        const entity = new Liability();
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
