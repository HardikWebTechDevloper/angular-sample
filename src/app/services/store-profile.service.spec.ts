import { TestBed } from '@angular/core/testing';

import { StoreProfileService } from './store-profile.service';

describe('StoreProfileService', () => {
  let service: StoreProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
