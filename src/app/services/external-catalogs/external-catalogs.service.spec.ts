import { TestBed } from '@angular/core/testing';

import { ExternalCatalogsService } from './external-catalogs.service';

describe('ExternalCatalogsService', () => {
  let service: ExternalCatalogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalCatalogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
