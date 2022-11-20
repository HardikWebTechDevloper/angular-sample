import { TestBed } from '@angular/core/testing';

import { AnalyticsReportService } from './analytics-report.service';

describe('AnalyticsReportService', () => {
  let service: AnalyticsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
