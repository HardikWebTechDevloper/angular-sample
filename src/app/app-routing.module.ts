import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoggedInGuard } from './auth/logged-in.guard';
import { OtpComponent } from './auth/otp/otp.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SuccessComponent } from './auth/success/success.component';

const routes: Routes = [
  // Fallback when no prior route is matched
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'otp',
    component: OtpComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: '',
    loadChildren: () => import(`./officer/officer.module`).then((module) => module.OfficerModule),
  },
  {
    path: '',
    loadChildren: () =>
      import(`./analytics-report/analytics-report.module`).then((module) => module.AnalyticsReportModule),
  },
  {
    path: '',
    loadChildren: () =>
      import(`./analytics-report-oficer/analytics-report-oficer.module`).then(
        (module) => module.AnalyticsReportOficerModule
      ),
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
