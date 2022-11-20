import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class OfficerDashboardService {
  constructor(private _http: HttpClient) {}
  getAlertCount() {
    return this._http.post(`officer/dashboard`, {});
  }

  getBackLogsList(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `officer/getRegisterBacklogsList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getPurchaseOrderList(payload: any) {
    let encryptedData = encrytData(payload);
    return this._http.post(
      `officer/getTransportPermitList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getLicenseeList() {
    return this._http.post(`officer/getLicenseeList`, {});
  }
  getLicenseeCategoryList() {
    return this._http.post(`officer/getLicenseeCategory`, {});
  }
}
