import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreProfileService {
  constructor(private _http: HttpClient) {}

  getDesignation() {
    return this._http.get(`designations`);
  }
}
