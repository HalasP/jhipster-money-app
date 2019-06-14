/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { MoneyUserDetailComponent } from 'app/entities/money-user/money-user-detail.component';
import { MoneyUser } from 'app/shared/model/money-user.model';

describe('Component Tests', () => {
  describe('MoneyUser Management Detail Component', () => {
    let comp: MoneyUserDetailComponent;
    let fixture: ComponentFixture<MoneyUserDetailComponent>;
    const route = ({ data: of({ moneyUser: new MoneyUser(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [MoneyUserDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(MoneyUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MoneyUserDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.moneyUser).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
