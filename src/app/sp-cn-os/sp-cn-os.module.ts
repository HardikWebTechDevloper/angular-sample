import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpCnOsRoutingModule } from './sp-cn-os-routing.module';
import { StoreProfileComponent } from './store-profile/store-profile.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { OpeningStockComponent } from './opening-stock/opening-stock.component';
import { SpTabsComponent } from './components/sp-tabs/sp-tabs.component';
import { SpCnOsComponent } from './sp-cn-os.component';
import { SharedModule } from '@app/@shared';
// import { SpGridComponent } from './components/sp-grid/sp-grid.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AddskuComponent } from './configuration/addsku/addsku.component';
// import { SpCategoryComponent } from './components/sp-category/sp-category.component';
import { SummaryPopupComponent } from './opening-stock/summary-popup/summary-popup.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpCnOsComponent,
    StoreProfileComponent,
    ConfigurationComponent,
    OpeningStockComponent,
    SpTabsComponent,
    // SpGridComponent,
    AddskuComponent,
    // SpCategoryComponent,
    SummaryPopupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SpCnOsRoutingModule,
    NgbModule,
    CarouselModule,
    TranslateModule,
  ],
})
export class SpCnOsModule {}
