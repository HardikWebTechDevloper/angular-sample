import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup/signup.component';
import { OtpComponent } from './otp/otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SuccessComponent } from './success/success.component';
import { BannerComponent } from './banner/banner.component';
import { SharedModule } from '@app/@shared';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, NgbModule, I18nModule, SharedModule, AuthRoutingModule],
  declarations: [
    BannerComponent,
    LoginComponent,
    SignupComponent,
    OtpComponent,
    ForgotPasswordComponent,
    SuccessComponent,
  ],
})
export class AuthModule {}
