import { TestBed } from '@angular/core/testing';

import { OfficerStoreprofileService } from './officer-storeprofile.service';

describe('OfficerStoreprofileService', () => {
  let service: OfficerStoreprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficerStoreprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
