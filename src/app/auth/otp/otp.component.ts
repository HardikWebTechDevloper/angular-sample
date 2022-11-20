import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';
import { OtpService } from '@app/services/otp.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  @Input() phoneNum: string;
  @Output() otpResult = new EventEmitter<string>();
  otp: string;
  otpValid: boolean = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '74px',
    },
    inputClass: '',
    containerClass: '',
  };
  constructor(private dataService: DataService, private alertService: AlertService, private _otpService: OtpService) {}

  ngOnInit(): void {}
  // On OTP change
  onOtpChange(otp: any, input: any) {
    console.log(input);
    this.otp = otp;
    if (this.otp.length == 6) {
      this.otpValid = true;
    } else {
      this.otpValid = false;
    }
  }
  // To submit the OTP
  otpSubmit() {
    console.log(this.phoneNum);
    let data = {
      mobileNumber: this.phoneNum,
      otp: this.otp,
    };
    this._otpService.otpVerify(data).subscribe((result: any) => {
      let res: any = result;
      console.log(res, res.data.type, 'type---');
      if (res.data.type == 'error') {
        this.alertService.error('Please enter valid OTP', { keepAfterRouteChange: false, autoClose: true });
      } else {
        this.otpResult.emit('success');
      }
    });
    //  this.otpResult.emit("success");
  }
  // Resend OTP
  resendOtp() {
    let data = {
      mobileNumber: this.phoneNum,
    };
    this._otpService.otpSend(data).subscribe(
      (result: any) => {
        console.log(result);
      },
      (resposeErr: any) => {
        console.log(resposeErr.error);
        let res = resposeErr.error;
        if (res.status == 'error') {
          this.alertService.error(res.error, { keepAfterRouteChange: true, autoClose: false });
        }
      }
    );
  }
}
