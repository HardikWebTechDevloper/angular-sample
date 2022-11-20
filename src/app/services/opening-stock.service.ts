import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class OpeningStockService {
  private httpClient: HttpClient;

  constructor(private _http: HttpClient, private httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(httpBackend);
  }

  getRetailCategory() {
    return this._http.get(`licensee/getRetailSubCategory`);
  }

  getAllDigitalExcise(data: any) {
    const encryptedData = encrytData(data);
    return this._http.post(
      `digitalExcise/getDigitalExcise`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  totalDigitalExcise() {
    return this._http.post(`digitalExcise/TotalDigitalExcise`, {});
  }
  saveDigitalExcise(payload: any) {
    const encryptedData = encrytData(payload);
    return this._http.post(
      `digitalExcise/saveDigitalExcise`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
}
