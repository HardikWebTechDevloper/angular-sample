import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '@app/_models/exciseregister';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class ExcisePuchaseService {
  constructor(private _http: HttpClient) {}
  getdigitalDetail() {
    return this._http.post(`licensee/getLastUpdatedLicenseeDate`, {});
  }
  getdigitalLastUpdated() {
    return this._http.post(`licensee/getCheckLastUpdatedLicenseeDate`, {});
  }
  validateInvoiceumber(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `licensee/validatePurchaseInvoiceNumber`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getPurchaseInfo(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `licensee/getLicenseePurchaseInfo`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getPurchaseSummary(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/totalPurchaseDigitalExcise`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  updatePuchaseSummary(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/savePurchaseExcise`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getInvoiceData(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `licensee/getInvoiceData`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  updateInvoice(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `licensee/getInvoiceNumber`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
}
