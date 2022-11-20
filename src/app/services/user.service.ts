import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  // public userSignIn(data: any) {
  //   return this._http.post<any>(`auth/signin`, data);
  // }

  public userSignIn(data: any) {
    let encryptedData = encrytData(data);

    return this._http.post(`auth/signin`, { data: encryptedData.text }, { headers: { ...encryptedData.headers } });
    // return this._http.post<any>(`auth/signin`, data);
  }

  public userSignUp(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post<any>(`auth/signup`, { data: encryptedData.text }, { headers: { ...encryptedData.headers } });
  }

  public updateUser(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post<any>(`user/update`, { data: encryptedData.text }, { headers: { ...encryptedData.headers } });
  }
  public verifyUser(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post<any>(
      `user/verifyLicense`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
}
