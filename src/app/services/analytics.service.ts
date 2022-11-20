import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private _http: HttpClient) {}

  getAnalyticsData(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `licensee/analytics`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getAnalyticOfficerData(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `officer/analytics`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
}
