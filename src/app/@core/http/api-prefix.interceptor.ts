import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';
import { decryptData } from 'src/helpers/crypto';
import { delay, finalize, map } from 'rxjs/operators';

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (!/^(http|https):/i.test(request.url)) {
    request = request.clone({
      url: environment.serverUrl + request.url,

      headers: request.headers.set('token', this.cookieService.get('userToken')),
    });
    // }
    return next.handle(request);
  }
}
