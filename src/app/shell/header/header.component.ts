import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, CredentialsService } from '@app/auth';
import { userDetails } from '@app/_models/header';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  userType: string;
  userDetails: userDetails;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private _cookieService: CookieService
  ) {}

  ngOnInit() {
    this.userType = this._cookieService.get('UserType');
    console.log(this.userType, 'this.userType');
    if (this.userType && this.userType !== 'L') {
      this.userDetails = JSON.parse(this._cookieService.get('userDetails'));
      console.log(this.userDetails);
    }
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
  routeTo() {
    if (this.userType == 'L') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/officer/dashboard']);
    }
  }
  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.MobileNumber : null;
  }
}
