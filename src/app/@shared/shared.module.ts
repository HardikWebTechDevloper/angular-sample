import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '@app/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './alert/alert.component';

import { NumbersOnlyDirective } from '../directives/numbers-only.directive';
import { MoveFocusDirective } from '../directives/move-focus.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SpCategoryComponent } from './sp-category/sp-category.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SpGridComponent } from './components/sp-grid/sp-grid.component';
import { SpSingleItemComponent } from './components/sp-single-item/sp-single-item.component';
import { NotificationPopupComponent } from './components/notification-popup/notification-popup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpTableComponent } from './components/sp-table/sp-table.component';
import { OrderbyPipe } from './pipes/orderby.pipe';
import { TabsComponent } from './components/tabs/tabs.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    NgOtpInputModule,
    TranslateModule,
    I18nModule,
    NgxSpinnerModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
  ],
  declarations: [
    LoaderComponent,
    AlertComponent,
    NumbersOnlyDirective,
    MoveFocusDirective,
    FilterPipe,
    SpCategoryComponent,
    SpGridComponent,
    SpSingleItemComponent,
    NotificationPopupComponent,
    SpTableComponent,
    OrderbyPipe,
    TabsComponent,
  ],
  exports: [
    NgOtpInputModule,
    TranslateModule,
    I18nModule,
    LoaderComponent,
    AlertComponent,
    NumbersOnlyDirective,
    MoveFocusDirective,
    FilterPipe,
    NgxSpinnerModule,
    CarouselModule,
    SpCategoryComponent,
    SpGridComponent,
    SpSingleItemComponent,
    SpTableComponent,
    NgbModule,
    OrderbyPipe,
    TabsComponent,
  ],
})
export class SharedModule {}
