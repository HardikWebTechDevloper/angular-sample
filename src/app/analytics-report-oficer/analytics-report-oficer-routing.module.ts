import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AnalyticsReportOficerComponent } from './analytics-report-oficer.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      component: AnalyticsReportOficerComponent,
      children: [
        {
          path: 'officer-analytics',
          component: AnalyticsComponent,
        },
        {
          path: 'officer-reports',
          component: ReportsComponent,
        },
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsReportOficerRoutingModule {}
