/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { MoneyUserComponent } from 'app/entities/money-user/money-user.component';
import { MoneyUserService } from 'app/entities/money-user/money-user.service';
import { MoneyUser } from 'app/shared/model/money-user.model';

describe('Component Tests', () => {
  describe('MoneyUser Management Component', () => {
    let comp: MoneyUserComponent;
    let fixture: ComponentFixture<MoneyUserComponent>;
    let service: MoneyUserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [MoneyUserComponent],
        providers: []
      })
        .overrideTemplate(MoneyUserComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MoneyUserComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(MoneyUserService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new MoneyUser(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.moneyUsers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
