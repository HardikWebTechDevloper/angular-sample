import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsReportRoutingModule } from './analytics-report-routing.module';
import { AnalyticsReportComponent } from './analytics-report.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ReportsComponent } from './reports/reports.component';
import { PastExerciseRegisterComponent } from './past-exercise-register/past-exercise-register.component';
import { CreateReportComponent } from './reports/create-report/create-report.component';
import { SharedModule } from '@app/@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AnalyticsReportComponent,
    AnalyticsComponent,
    ReportsComponent,
    PastExerciseRegisterComponent,
    CreateReportComponent,
  ],
  imports: [CommonModule, AnalyticsReportRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, ChartsModule],
})
export class AnalyticsReportModule {}
