import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AnalyticsReportComponent } from './analytics-report.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PastExerciseRegisterComponent } from './past-exercise-register/past-exercise-register.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      component: AnalyticsReportComponent,
      children: [
        {
          path: 'analytics',
          component: AnalyticsComponent,
        },
        {
          path: 'reports',
          component: ReportsComponent,
        },
        {
          path: 'past-exercise-register',
          component: PastExerciseRegisterComponent,
        },
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsReportRoutingModule {}
