import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { DataService } from '@app/services/data.service';
import { DesignationService } from '@app/services/designation.service';
import { JurisdictionService } from '@app/services/jurisdiction.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { OtpService } from '@app/services/otp.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  licenseeForm: boolean = true;
  officerForm: boolean;
  otpshow: boolean = false;
  createPassword: boolean = false;
  designations: any;
  jurisdiction: any;
  dJurisdiction: any;
  phoneNumber: any;
  successMsg: boolean = false;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private alertService: AlertService,
    private _jurisdictionService: JurisdictionService,
    private _designationService: DesignationService,
    private _otpService: OtpService,
    private _userService: UserService,
    private notifiService: NotificationPopupService
  ) {
    this.dJurisdiction = [];
  }

  // licensee signup form validation
  licenseeSignup = new FormGroup({
    // lCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
    lCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    panNumber: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{10}$/)]),
    // panNumber: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}$/)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
  });

  // officer signup form validation
  officerSignup = new FormGroup({
    designation: new FormControl('', Validators.required),
    jurisdiction: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
  });

  // register form validation
  registerForm = this.formBuilder.group(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,15}$'),
      ]),
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
  // register form validation end
  ngOnInit(): void {
    this.getDesignations();
    this.getJurisdiction();
  }

  // signup option for licensee and officer
  signupToggle(data: any) {
    if (data == 'licensee') {
      this.licenseeForm = true;
      this.officerForm = false;
    } else {
      this.officerForm = true;
      this.licenseeForm = false;
    }
  }

  // licensee signup form validation controls
  get licenseeFormControl() {
    return this.licenseeSignup.controls;
  }
  //Officer signup form validation controls
  get officerFormControl() {
    return this.officerSignup.controls;
  }

  //Officer signup form validation controls
  get registerFormControl() {
    return this.registerForm.controls;
  }

  // get designations list
  getDesignations() {
    this._designationService.getDesignation().subscribe((result: any) => {
      let data: any = result;
      if (data.status == '200') {
        this.designations = data.data;
      }
    });
  }
  //get Jurisdiction List
  getJurisdiction() {
    this._jurisdictionService.getJusrisdiction().subscribe((result: any) => {
      console.log(result);
      let data: any = result;
      if (data.status == 'success' || data.status == 200) {
        this.jurisdiction = data.data;
      }
    });
  }
  // filter jurisdiction based on designation
  filterJurisdiction(val: any) {
    this.dJurisdiction = [];
    this.jurisdiction.forEach((element: any) => {
      if (element.DesignationCode == val) {
        this.dJurisdiction.push(element);
      }
    });
  }

  // generate otp
  generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  // request otp
  requestOtp(data: any) {
    this._otpService.otpSend(data).subscribe((result: any) => {
      console.log(result);
      let res: any = result;
      if (res.data.type == 'success' || data.status == 200) {
        this.otpshow = true;
      } else {
        this.alertService.error(result.data.error, { keepAfterRouteChange: true, autoClose: true });
      }
    });
  }
  // To verify the user already exits before signup
  verifyUser() {
    let data;
    if (this.licenseeForm) {
      this.phoneNumber = this.licenseeSignup.get('phone').value;
      data = {
        MobileNumber: this.licenseeSignup.get('phone').value,
        UserType: 'L',
        PAN: this.licenseeSignup.get('panNumber').value,
        LicenseeID: this.licenseeSignup.get('lCode').value,
        OfficerMasterExcise: '0',
      };
    }

    if (this.officerForm) {
      this.phoneNumber = this.officerSignup.get('phone').value;
      data = {
        MobileNumber: this.officerSignup.get('phone').value,
        UserType: 'o',
        PAN: '',
        LicenseeID: '',
        password: this.registerForm.get('password').value,
        OfficerMasterExcise: '1',
      };
    }
    this._userService.verifyUser(data).subscribe(
      (result: any) => {
        if (result.status == 'success' || result['status'] === 200) {
          let otp = this.generateOTP();
          console.log(otp);
          let data = {
            mobileNumber: this.phoneNumber,
            otp: otp,
          };
          console.log(data);
          this.requestOtp(data);
          // this.createPassword = false;
          // this.successMsg = true;
          console.log(result);
        } else {
          // this.alertService.error(result.data.error, { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: result.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          this.licenseeSignup.setErrors({ invalid: true });
          const keysSignIn = Object.keys(this.licenseeSignup.value);
          keysSignIn.forEach((val) => {
            const ctrl = this.licenseeSignup.controls[val];
            if (!ctrl.valid) {
              ctrl.markAsTouched();
            }
          });
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
  // licensee signup onsubmit
  licenseeOnSubmit() {
    this.phoneNumber = this.licenseeSignup.get('phone').value;
    let data = {
      MobileNumber: this.licenseeSignup.get('phone').value,
      UserType: 'L',
      PAN: this.licenseeSignup.get('panNumber').value,
      LicenseeID: this.licenseeSignup.get('lCode').value,
      password: this.registerForm.get('password').value,
      OfficerMasterExcise: '0',
    };
    this._userService.userSignUp(data).subscribe(
      (result: any) => {
        if (result.status == 'success' || result['status'] === 200) {
          // let otp = this.generateOTP();
          // console.log(otp);
          // let data = {
          //   mobileNumber: result.data.MobileNumber,
          //   otp: otp,
          // };
          // console.log(data);
          // this.requestOtp(data);
          console.log(result);
          this.createPassword = false;
          this.successMsg = true;
        } else {
          // this.alertService.error(result.data.error, { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: result.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
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
    // this.otpshow=true;
  }

  // officer signup submit
  officerOnSubmit() {
    console.log(this.officerSignup.value);
    this.phoneNumber = this.officerSignup.get('phone').value;
    let data = {
      MobileNumber: this.officerSignup.get('phone').value,
      UserType: 'o',
      PAN: '',
      LicenseeID: '',
      password: this.registerForm.get('password').value,
      OfficerMasterExcise: '1',
    };
    this._userService.userSignUp(data).subscribe(
      (result: any) => {
        if (result.status == 'success' || result.status === 200) {
          // let otp = this.generateOTP();
          // console.log(otp);
          // let data = {
          //   mobileNumber: result.data.MobileNumber,
          //   otp: otp,
          // };
          // console.log(data);
          // this.requestOtp(data);
          this.createPassword = false;
          this.successMsg = true;
        } else {
          // this.alertService.error(result.data.error, { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: result.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
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
    // this.otpshow=true;
  }
  // based on they type Calling respective signup
  signupRegisterUser() {
    if (this.licenseeForm) {
      this.licenseeOnSubmit();
    }
    if (this.officerForm) {
      this.officerOnSubmit();
    }
  }
  // OTP sumit function
  otpSubmitted(data: any) {
    console.log(data);
    if (data == 'success') {
      this.createPassword = true;
      this.otpshow = false;
    }
  }
  // Update user details
  signupRegister() {
    console.log(this.registerForm.value);
    let data = {
      MobileNumber: this.phoneNumber,
      password: this.registerForm.get('password').value,
    };
    this._userService.updateUser(data).subscribe(
      (result: any) => {
        if (result.status === 'success' || result.status === 200) {
          this.createPassword = false;
          this.successMsg = true;
          console.log(result);
        } else {
          // this.alertService.error(result.data.error);
          const alertObj = {
            title: '',
            text: result.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
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
  // On key press checking the input values
  keyPressAlphaNumeric(event: any) {
    const inp = String.fromCharCode(event.keyCode);
    const regex = /[0-9]/;
    if (regex.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
