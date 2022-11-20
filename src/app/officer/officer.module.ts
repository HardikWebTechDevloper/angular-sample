import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficerRoutingModule } from './officer-routing.module';
import { OfficerComponent } from './officer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreProfileComponent } from './store-profile/store-profile.component';
import { AlertsComponent } from './alerts/alerts.component';
import { SharedModule } from '@app/@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { StoreProfileListComponent } from './store-profile-list/store-profile-list.component';
import { ExciseRegisterComponent } from './excise-register/excise-register.component';

@NgModule({
  declarations: [
    OfficerComponent,
    DashboardComponent,
    StoreProfileComponent,
    AlertsComponent,
    StoreProfileListComponent,
    ExciseRegisterComponent,
  ],
  imports: [CommonModule, OfficerRoutingModule, SharedModule, FormsModule, ReactiveFormsModule, ChartsModule],
})
export class OfficerModule {}
