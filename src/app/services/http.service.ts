import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { decryptData, encrytData } from 'src/helpers/crypto';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  get(url: string, options?: any, header?: object): Observable<any> {
    let encryptedData = encrytData(options);
    const params = this.buildParams(options);
    return this.http.get(url, { params }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => this.err(error))
    );
  }

  post(url: string, options: object, header?: object): Observable<any> {
    let encryptedData = encrytData(options);
    return this.http.post(url, { data: encryptedData.text }, { headers: { ...encryptedData.headers } }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => this.err(error))
    );
  }

  put(url: string, options: object, header?: object): Observable<any> {
    let encryptedData = encrytData(options);
    return this.http.put(url, { data: encryptedData.text }, { headers: { ...encryptedData.headers } }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => this.err(error))
    );
  }

  delete(url: string, options: object, header?: object): Observable<any> {
    return this.http.delete(url, options).pipe(
      map((res) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => this.err(error))
    );
  }

  /*
  Converts to query string
 @param { object } params - its prequires object which needs to be converted to query string
  @returns strings of query params, eg., user=abcd&todo=delete
 */

  private buildParams(params: any): any {
    const outputParams = new HttpParams();
    // tslint:disable-next-line: forin
    for (const key in params) {
      outputParams.set(key, params[key]);
    }
    return params || {};
  }

  /*
   Converting to common error format
   @param error
  */
  err(error: HttpErrorResponse): any {
    // this.loader.setLoader(false);
    let resError = error.error;
    // let errCommon: ErrorCommon;
    if (resError instanceof ErrorEvent) {
      return throwError(resError.message);
    } else {
      return throwError('Something went wrong');
    }
  }
}
