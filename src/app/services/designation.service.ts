import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  constructor(private _http: HttpClient) {}

  getDesignation() {
    console.log('hhhhhh');
    return this._http.get(`designations`);
  }
}
