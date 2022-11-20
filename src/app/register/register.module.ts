import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { PurchaseComponent } from './purchase/purchase.component';
import { SalesComponent } from './sales/sales.component';
import { RegisterComponent } from './register.component';
import { SharedModule } from '@app/@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegTabsComponent } from './components/reg-tabs/reg-tabs.component';
import { PurchaseConfimationComponent } from './purchase/purchase-confimation/purchase-confimation.component';
import { PurchaseSummaryComponent } from './purchase/purchase-summary/purchase-summary.component';
import { SaleSummaryComponent } from './sales/sale-summary/sale-summary.component';
import { StockComponent } from './stock/stock.component';
import { StockSummaryComponent } from './stock/stock-summary/stock-summary.component';

@NgModule({
  declarations: [
    PurchaseComponent,
    SalesComponent,
    RegisterComponent,
    RegTabsComponent,
    PurchaseConfimationComponent,
    PurchaseSummaryComponent,
    SaleSummaryComponent,
    StockComponent,
    StockSummaryComponent,
  ],
  imports: [CommonModule, SharedModule, RegisterRoutingModule, FormsModule, ReactiveFormsModule],
})
export class RegisterModule {}
