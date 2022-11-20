import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';

export interface Credentials {
  // Customize received credentials here
  MobileNumber: string;
  token: string;
}

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;
  private checkLoggedInStatus: boolean = false;

  constructor(private cookieService: CookieService, @Inject(PLATFORM_ID) private platformId: Object) {
    const cookieExists: boolean = cookieService.check('userToken');
    this.checkLoggedInStatus = cookieExists;
    console.log(cookieExists, 'jjjjjjggg');
    if (isPlatformBrowser(this.platformId)) {
      const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
      if (savedCredentials) {
        this._credentials = JSON.parse(savedCredentials);
      }
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    // return !!this.credentials;
    return !!this.checkLoggedInStatus;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      if (isPlatformBrowser(this.platformId)) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(credentialsKey, JSON.stringify(credentials));
      }
    } else {
      this.cookieService.delete('userToken', '/');
      this.cookieService.delete('userDetails', '/');
      this.cookieService.delete('UserType', '/');
      this.cookieService.delete('licenseeDetails', '/');
      this.cookieService.deleteAll('/');
      if (isPlatformBrowser(this.platformId)) {
        sessionStorage.removeItem(credentialsKey);
      }
      localStorage.removeItem(credentialsKey);
    }
  }
}
