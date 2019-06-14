/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { LiabilityComponent } from 'app/entities/liability/liability.component';
import { LiabilityService } from 'app/entities/liability/liability.service';
import { Liability } from 'app/shared/model/liability.model';

describe('Component Tests', () => {
  describe('Liability Management Component', () => {
    let comp: LiabilityComponent;
    let fixture: ComponentFixture<LiabilityComponent>;
    let service: LiabilityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [LiabilityComponent],
        providers: []
      })
        .overrideTemplate(LiabilityComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LiabilityComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LiabilityService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Liability(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.liabilities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
