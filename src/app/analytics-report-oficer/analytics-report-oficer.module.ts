import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsReportOficerRoutingModule } from './analytics-report-oficer-routing.module';
import { AnalyticsReportOficerComponent } from './analytics-report-oficer.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ReportsComponent } from './reports/reports.component';
import { SharedModule } from '@app/@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CreateReportComponent } from './reports/create-report/create-report.component';

@NgModule({
  declarations: [AnalyticsReportOficerComponent, AnalyticsComponent, ReportsComponent, CreateReportComponent],
  imports: [
    CommonModule,
    AnalyticsReportOficerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
  ],
})
export class AnalyticsReportOficerModule {}
