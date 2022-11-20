import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class ExciseSalesService {
  constructor(private _http: HttpClient) {}

  getExciseRetailSubCategory(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/getExciseRetailSubCategory`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }

  getExciseDigitalList(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/getDigitalExciseList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getExciseDigitalSummary(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/getExciseSaleSummary`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }

  updateSKUAlias(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `sku/updateRetailSKUAlias`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }

  updateLicenseeSale(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/updateLicenseeSale`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  submitSalesSummary(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/UpdateMoveNextDate`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  updateLicenseeCloseStock(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/updateLicenseeCloseStock`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }

  getTotalDigitalSummary(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/totalCloseDigitalExcise`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getEnableStatus() {
    return this._http.post(`digitalExcise/checkDigitalExcise`, {});
  }
}
