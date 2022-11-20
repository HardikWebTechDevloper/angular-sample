import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';
import { OtpService } from '@app/services/otp.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  otpshow: boolean = false;
  createPassword: boolean = false;
  pwdShow: boolean = false;
  phoneNumber: any;
  successMsg: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private alertService: AlertService,
    private _otpService: OtpService,
    private _userService: UserService
  ) {}

  // login form validation
  fPwdForm = new FormGroup({
    MobileNumber: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
  });

  // register form validation
  registerForm = this.formBuilder.group(
    {
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9]).{8,20}$')]),
      confirmPassword: new FormControl('', Validators.required),
    },
    {
      validator: this.MustMatch('password', 'confirmPassword'),
    }
  );

  // password and confirmPassword values match
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ngOnInit(): void {}
  // login form controls
  get fPwdFormControl() {
    return this.fPwdForm.controls;
  }

  //Officer signup form validation controls
  get registerFormControl() {
    return this.registerForm.controls;
  }

  //Mobile number submit
  fPwdFormSubmit() {
    this.phoneNumber = this.fPwdForm.get('MobileNumber').value;
    let data = {
      mobileNumber: this.fPwdForm.get('MobileNumber').value,
    };
    this._otpService.otpSend(data).subscribe(
      (result: any) => {
        console.log(result);
        if (result.status === 200 || result.status === 'success') {
          this.otpshow = true;
        } else {
          this.alertService.error(result.data.error, { keepAfterRouteChange: true, autoClose: true });
        }
      },
      (resposeErr: any) => {
        console.log(resposeErr.error);
        let res = resposeErr.error;
        if (res.status == 'error') {
          this.alertService.error(res.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }

  //otp submit
  otpSubmitted(data: any) {
    console.log(data);
    if (data == 'success' || data.status == 200) {
      this.otpshow = false;
      this.createPassword = true;
    }
  }
  // new password submit
  passwordSubmit() {
    console.log(this.registerForm.value);
    let data = {
      MobileNumber: this.phoneNumber,
      password: this.registerForm.get('password').value,
    };
    this._userService.updateUser(data).subscribe(
      (result: any) => {
        console.log(result);
        if (result.status == 'success' || result.status == 200) {
          this.createPassword = false;
          this.successMsg = true;
        } else {
          this.alertService.error(result.data.error, { keepAfterRouteChange: true, autoClose: true });
        }
      },
      (resposeErr: any) => {
        console.log(resposeErr.error);
        let res = resposeErr.error;
        if (res.status == 'error') {
          this.alertService.error(res.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
}
