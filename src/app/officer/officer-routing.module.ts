import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { AlertsComponent } from './alerts/alerts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExciseRegisterComponent } from './excise-register/excise-register.component';
import { OfficerComponent } from './officer.component';
import { StoreProfileListComponent } from './store-profile-list/store-profile-list.component';
import { StoreProfileComponent } from './store-profile/store-profile.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'officer',
      component: OfficerComponent,
      children: [
        {
          path: 'dashboard',
          component: DashboardComponent,
        },
        {
          path: 'store-profile',
          component: StoreProfileComponent,
        },
        {
          path: 'store-profile-list',
          component: StoreProfileListComponent,
        },
        {
          path: 'alerts',
          component: AlertsComponent,
        },
        {
          path: 'excise-register',
          component: ExciseRegisterComponent,
        },
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficerRoutingModule {}
