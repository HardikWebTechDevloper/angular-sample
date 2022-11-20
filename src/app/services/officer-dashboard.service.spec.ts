import { TestBed } from '@angular/core/testing';

import { OfficerDashboardService } from './officer-dashboard.service';

describe('OfficerDashboardService', () => {
  let service: OfficerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
