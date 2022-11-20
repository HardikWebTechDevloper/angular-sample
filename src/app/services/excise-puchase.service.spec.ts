import { TestBed } from '@angular/core/testing';

import { ExcisePuchaseService } from './excise-puchase.service';

describe('ExcisePuchaseService', () => {
  let service: ExcisePuchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcisePuchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
