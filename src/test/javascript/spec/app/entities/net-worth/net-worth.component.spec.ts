/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { NetWorthComponent } from 'app/entities/net-worth/net-worth.component';
import { NetWorthService } from 'app/entities/net-worth/net-worth.service';
import { NetWorth } from 'app/shared/model/net-worth.model';

describe('Component Tests', () => {
  describe('NetWorth Management Component', () => {
    let comp: NetWorthComponent;
    let fixture: ComponentFixture<NetWorthComponent>;
    let service: NetWorthService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [NetWorthComponent],
        providers: []
      })
        .overrideTemplate(NetWorthComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NetWorthComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(NetWorthService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new NetWorth(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.netWorths[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
