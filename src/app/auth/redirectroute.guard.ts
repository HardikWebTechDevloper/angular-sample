import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectrouteGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userType: string = this.cookieService.get('UserType') ? this.cookieService.get('UserType') : 'L';
    console.log(userType, 'userType----');
    if (userType === 'L') {
      return true;
    }
    this.router.navigate(['/officer/dashboard']);
    return false;
  }
}
