/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { MoneyUserUpdateComponent } from 'app/entities/money-user/money-user-update.component';
import { MoneyUserService } from 'app/entities/money-user/money-user.service';
import { MoneyUser } from 'app/shared/model/money-user.model';

describe('Component Tests', () => {
  describe('MoneyUser Management Update Component', () => {
    let comp: MoneyUserUpdateComponent;
    let fixture: ComponentFixture<MoneyUserUpdateComponent>;
    let service: MoneyUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [MoneyUserUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(MoneyUserUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MoneyUserUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MoneyUserService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new MoneyUser(123);
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
        const entity = new MoneyUser();
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
