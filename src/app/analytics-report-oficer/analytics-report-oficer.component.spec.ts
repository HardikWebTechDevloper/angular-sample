import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsReportOficerComponent } from './analytics-report-oficer.component';

describe('AnalyticsReportOficerComponent', () => {
  let component: AnalyticsReportOficerComponent;
  let fixture: ComponentFixture<AnalyticsReportOficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsReportOficerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsReportOficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
