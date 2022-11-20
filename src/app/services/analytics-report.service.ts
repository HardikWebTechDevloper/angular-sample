import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsReportService {
  constructor(private _http: HttpClient) {}

  getLicenseeReports(data: any) {
    let encryptedData = encrytData(data);

    return this._http.post(
      `licensee/generateLicenseeReportList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getOfficerReports(data: any) {
    let encryptedData = encrytData(data);

    return this._http.post(
      `officer/generateOfficerReportList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  createReport(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `licensee/generateLicenseeReport`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  createOfficerReport(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `officer/generateOfficerReport`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getPastExcise(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `digitalExcise/pastExciseList`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  forwardReport(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `licensee/forwardLicenseeReportToOfficer`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  forwardMailToOficer(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `licensee/emailLicenseeReportToOfficer`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  downloadPDF(data: any) {
    let encryptedData = encrytData(data);
    console.log('kkkkkkkkkkkkkkkk');
    return this._http.post(
      `licensee/downloadLicenseeReport`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
    // return this._http.get(
    //   `licensee/downloadLicenseeReport/`+ data,
    // );
  }
  downloadFile(url: any): any {
    return this._http.get(url, { responseType: 'blob' });
  }
}
