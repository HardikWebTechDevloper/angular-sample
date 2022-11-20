import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private _http: HttpClient) {}

  // otp send service
  otpSend(data: any) {
    return this._http.get(`otp/send/${data.mobileNumber}`);
  }
  // otp verify service
  otpVerify(data: any) {
    return this._http.get(`otp/verify/${data.mobileNumber}/${data.otp}`);
  }
}
