import { TestBed } from '@angular/core/testing';

import { ExciseSalesService } from './excise-sales.service';

describe('ExciseSalesService', () => {
  let service: ExciseSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExciseSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
