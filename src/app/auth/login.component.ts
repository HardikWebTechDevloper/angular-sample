import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { AlertService } from 'src/app/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { SpinnerService } from '@app/services/spinner.service';
import { LicenseeService } from '@app/services/licensee.service';
import { CookieService } from 'ngx-cookie-service';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  pwdShow: boolean;
  // login form validation
  loginForm = new FormGroup({
    MobileNumber: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    password: new FormControl('', [Validators.required]),
  });
  isLoading: boolean;
  error: any;
  constructor(
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private spinner: SpinnerService,
    private _licenseeService: LicenseeService,
    private _cookieService: CookieService
  ) {}

  ngOnInit(): void {}
  // login form controls
  get loginFormControl() {
    return this.loginForm.controls;
  }

  // login form on submit
  loginSubmit() {
    this.isLoading = true;
    this.spinner.show();
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials: any) => {
          this.spinner.hide();
          if (credentials['status'] == 200 || credentials['status'] === 'success') {
            log.debug(`${credentials.username} successfully logged in`);
            const userType = credentials.data.UserType;
            this._cookieService.set('UserType', userType);
            this._cookieService.set('userDetails', JSON.stringify(credentials.data));
            if (userType === 'L') {
              this._licenseeService.getLicenseeById().subscribe((res: any) => {
                if (res.status === 'success' || res.status === 200) {
                  this._cookieService.set('licenseeDetails', JSON.stringify(res.data));
                  if (credentials.data.loginType === 'F') {
                    this.router.navigate(['/store-profile']);
                  } else {
                    this.router.navigate(['/']);
                  }
                } else {
                  if (credentials.data.loginType === 'F') {
                    this.router.navigate(['/store-profile']);
                  } else {
                    this.router.navigate(['/']);
                  }
                }
              });
              // this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
            } else {
              this.router.navigate(['officer/dashboard']);
            }
          } else {
            this.loginForm.reset();
            this.alertService.error(credentials['data'].error, { keepAfterRouteChange: true, autoClose: true });
          }
        },
        (errorResponse: any) => {
          this.spinner.hide();
          console.log(`Login error: ${errorResponse}`);
          this.error = errorResponse;
          console.log(errorResponse);
          if (errorResponse.error.status == 'error') {
            console.log('ERROR');
            this.alertService.error(errorResponse.error.error, { keepAfterRouteChange: true, autoClose: true });
          }
        }
      );
  }
}
