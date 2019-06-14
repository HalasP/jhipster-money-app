/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { LiabilityDetailComponent } from 'app/entities/liability/liability-detail.component';
import { Liability } from 'app/shared/model/liability.model';

describe('Component Tests', () => {
  describe('Liability Management Detail Component', () => {
    let comp: LiabilityDetailComponent;
    let fixture: ComponentFixture<LiabilityDetailComponent>;
    const route = ({ data: of({ liability: new Liability(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [LiabilityDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(LiabilityDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LiabilityDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.liability).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
