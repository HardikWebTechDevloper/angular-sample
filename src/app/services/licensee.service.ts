import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class LicenseeService {
  constructor(private _http: HttpClient) {}
  samplePost(data: any) {
    let encryptedData = encrytData(data);
    console.log(encryptedData.headers);
    return this._http.post(
      `postSampeData/testr`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getAllLicensee() {
    return this._http.get(`licensee`);
  }

  getLicenseeById() {
    // let encryptedData = encrytData(licenseeId);
    return this._http.post(`licensee/getLicensee`, {});
    // return this._http.get(`getSampeData`);
  }

  updateLicensee(payload: Object) {
    let encryptedData = encrytData(payload);
    // return  this.http.put(`licensee/update_licence`,payload);

    console.log(encryptedData.headers);
    return this._http.put(
      `licensee/update_licence`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
}
