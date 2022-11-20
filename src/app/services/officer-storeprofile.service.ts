import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class OfficerStoreprofileService {
  constructor(private _http: HttpClient) {}

  getStorprofile(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `officer/geLicenseeList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getStoreDetail(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `licensee/getOfficerLicenseeById`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getLicenseeRange() {
    return this._http.post(`officer/getLicenseeRange`, {});
  }
  getLicenseeByID(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `licensee/getOfficerLicenseeById`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getLicenseeExcise(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `officer/getLicenseeExcise`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
}
