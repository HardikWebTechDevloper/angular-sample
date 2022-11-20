import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseUrl: string = 'http://15.207.96.101/api/v1/';
  redirectUrl: string;
  private _httpClient: HttpClient;

  constructor(private httpClient: HttpClient, private httpBackend: HttpBackend, private _cookieService: CookieService) {
    this._httpClient = new HttpClient(httpBackend);
  }
  //  user signin service
  public userSignIn(data: any) {
    return this.httpClient.post<any>(this.baseUrl + 'auth/signin', data).pipe(
      map((userDetails) => {
        console.log(userDetails);
        if (userDetails.status == 'success') {
          this.setToken(userDetails.data.token);
        }
        return userDetails;
      })
    );
  }

  //  user signup service
  public userSignUp(data: any) {
    return this.httpClient.post<any>(this.baseUrl + 'auth/signup', data).pipe(
      map((userDetails) => {
        console.log(userDetails);
        if (userDetails.status == 'success') {
          this.setToken(userDetails.data.token);
        }
        return userDetails;
      })
    );
  }

  // otp send service
  otpSend(data: any) {
    return this.httpClient.get(this.baseUrl + 'otp/send/' + data.mobileNumber);
  }
  // otp verify service
  otpVerify(data: any) {
    return this.httpClient.get(this.baseUrl + 'otp/verify/' + data.mobileNumber + '/' + data.otp);
  }
  //updateUser
  updateUser(data: any) {
    return this.httpClient.post<any>(this.baseUrl + 'user/update', data);
  }

  // // forgot password otp send service
  // fOtpSend(data:any) {
  //   return this.httpClient.get(this.baseUrl + 'otp/send/' + data.mobileNumber);
  // }
  // // otp verify service
  // fOtpVerify(data:any) {
  //   return this.httpClient.get(this.baseUrl + 'otp/verify/' + data.mobileNumber + "/" + data.otp);
  // }
  // //updateUser
  // fChangePassword(data:any) {
  //   return this.httpClient.post<any>(this.baseUrl + "user/update", data);
  // }

  //get Designations List
  getDesignations() {
    return this.httpClient.get(this.baseUrl + 'designations');
  }

  // get jurisdiction  List
  getJurisdiction() {
    return this.httpClient.get(this.baseUrl + 'jurisdiction');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }
  getDexpDate() {
    const dexpDate = JSON.parse(this._cookieService.get('DexpDate'));
    return dexpDate;
  }
  isLoggedIn() {
    const usertoken = this.getToken();
    if (usertoken != null) {
      return true;
    } else {
      return false;
    }
  }

  getAllSubCategory() {
    return this.httpClient.get(`licensee/getAllSubCategory`);
  }
  getHeaderData() {
    return this._httpClient.get(`assets/json/sample.json`);
  }
  getHeaderOfficerData() {
    return this._httpClient.get(`assets/json/officer.json`);
  }
  checkLicenseeConfigured() {
    return this.httpClient.get(`licensee/checkLicenseeConfigured`);
  }
  getLastUpdatedDate() {
    return this.httpClient.get(`licensee/getLastUpdatedDate`);
  }
  getAlertMessage() {
    return this.httpClient.get(`licensee/getAlertMessage`);
  }
}
