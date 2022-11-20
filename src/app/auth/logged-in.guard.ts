import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CredentialsService } from './credentials.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(
    private router: Router,
    private credentialsService: CredentialsService,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cookieExists: boolean = this.cookieService.check('userToken');
    if (cookieExists) {
      this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
      return false;
    } else {
      return true;
    }
  }
}
