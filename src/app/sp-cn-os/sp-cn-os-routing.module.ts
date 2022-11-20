import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { ConfigurationComponent } from './configuration/configuration.component';
import { OpeningStockComponent } from './opening-stock/opening-stock.component';
import { SpCnOsComponent } from './sp-cn-os.component';
import { StoreProfileComponent } from './store-profile/store-profile.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      component: SpCnOsComponent,
      children: [
        {
          path: 'store-profile',
          component: StoreProfileComponent,
        },
        {
          path: 'configuration',
          component: ConfigurationComponent,
        },
        {
          path: 'opening-stock',
          component: OpeningStockComponent,
        },
      ],
    },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpCnOsRoutingModule {}
