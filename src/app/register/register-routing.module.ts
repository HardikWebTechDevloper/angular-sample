import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { PurchaseComponent } from './purchase/purchase.component';
import { SalesComponent } from './sales/sales.component';
import { RegisterComponent } from './register.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      component: RegisterComponent,
      children: [
        {
          path: 'purchase',
          component: PurchaseComponent,
        },
        {
          path: 'sales',
          component: SalesComponent,
        },
        {
          path: 'stock',
          component: StockComponent,
        },
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
