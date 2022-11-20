import { Injectable } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Credentials, CredentialsService } from './credentials.service';

export interface LoginContext {
  MobileNumber: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private _userService: UserService) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data = {
      MobileNumber: context.MobileNumber,
      token: '123456',
    };
    // return this.httpClient.post<any>(this.baseUrl + "auth/signin", data)

    return this._userService.userSignIn(context).pipe(
      map((userDetails: any) => {
        console.log('user', userDetails);
        if (userDetails.status == 'success' || userDetails.status == 200) {
          this.setToken(userDetails.data.token);
          this.credentialsService.setCredentials(userDetails.data, context.remember);
        }
        return userDetails;
      })
    );
    //  return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
}
