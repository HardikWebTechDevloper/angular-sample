import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SkuProduct } from '@app/_models/skuproduct';
import { encrytData } from 'src/helpers/crypto';

@Injectable({
  providedIn: 'root',
})
export class ConfiguarationService {
  private httpClient: HttpClient;
  constructor(private _http: HttpClient, private httpBackend: HttpBackend) {
    this.httpClient = new HttpClient(httpBackend);
  }

  getRetailCategory() {
    return this._http.get(`licensee/getRetailSubCategory`);
  }

  getAllRetailSKU(data: any) {
    let encryptedData = encrytData(data);
    return this._http.post(
      `sku/getAllRetailSKU`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  getAllMasterSKU(data: any) {
    let encryptedData = encrytData(data);
    console.log(encryptedData.headers);
    return this._http.post(
      `sku/getAllSKUMasterBySubcategory`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  updateRetailSKU(payload: any) {
    let encryptedData = encrytData(payload);
    console.log(encryptedData.headers);
    return this._http.post(
      `sku/updateRetailSKU`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  checkSKUAlias(payload: any) {
    let encryptedData = encrytData(payload);
    console.log(encryptedData.headers);
    return this._http.post(
      `sku/CheckSKUAlias`,
      { data: encryptedData.text },
      { headers: { ...encryptedData.headers } }
    );
  }
  addSKUData(payload: any) {
    let encryptedData = encrytData(payload);
    console.log(encryptedData.headers);
    return this._http.post(`sku/addRetailSKU`, { data: encryptedData.text }, { headers: { ...encryptedData.headers } });
  }
}
