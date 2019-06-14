/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { JhipsterMoneyAppTestModule } from '../../../test.module';
import { AssetComponent } from 'app/entities/asset/asset.component';
import { AssetService } from 'app/entities/asset/asset.service';
import { Asset } from 'app/shared/model/asset.model';

describe('Component Tests', () => {
  describe('Asset Management Component', () => {
    let comp: AssetComponent;
    let fixture: ComponentFixture<AssetComponent>;
    let service: AssetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhipsterMoneyAppTestModule],
        declarations: [AssetComponent],
        providers: []
      })
        .overrideTemplate(AssetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AssetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AssetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Asset(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.assets[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
