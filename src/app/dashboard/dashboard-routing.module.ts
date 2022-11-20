import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedirectrouteGuard } from '@app/auth/redirectroute.guard';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      component: DashboardComponent,
      data: { title: marker('Dashboard') },
      canActivate: [RedirectrouteGuard],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
