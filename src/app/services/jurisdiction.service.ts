import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JurisdictionService {
  constructor(private _http: HttpClient) {}

  getJusrisdiction() {
    return this._http.get(`jurisdiction`);
  }
}
