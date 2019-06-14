/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { NetWorthDetailComponent } from 'app/entities/net-worth/net-worth-detail.component';
import { NetWorth } from 'app/shared/model/net-worth.model';

describe('Component Tests', () => {
  describe('NetWorth Management Detail Component', () => {
    let comp: NetWorthDetailComponent;
    let fixture: ComponentFixture<NetWorthDetailComponent>;
    const route = ({ data: of({ netWorth: new NetWorth(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [NetWorthDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(NetWorthDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(NetWorthDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.netWorth).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
