import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { Storage } = Plugins;
import { Preferences } from '@capacitor/preferences';
const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentAccessToken = '';
  url = environment.api;

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  // Load accessToken on startup
  async loadToken() {
    const token = await Preferences.get({ key: ACCESS_TOKEN_KEY });
    if (token && token.value) {
      this.currentAccessToken = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  // Get our secret protected data
  user() {
    return this.http.get(`${this.url}/user`, {withCredentials: true});
  }

  // Create new user
  signUp(credentials: {username: any, password: any}): Observable<any> {
    return this.http.post(`${this.url}/users`, credentials);
  }

  // Sign in a user and store access and refres token
  login(credentials: { email: any; password: any }): Observable<any> {
  return this.http.post(`${this.url}/login`, credentials).pipe(
    switchMap((data: any) => {
      this.currentAccessToken = data.accessToken;
      const storeAccess = Preferences.set({ key: ACCESS_TOKEN_KEY, value: data.token });
      const storeRefresh = Preferences.set({ key: REFRESH_TOKEN_KEY, value: data.refresh_token });
      console.log('access token is : '+data.token);
      console.log('refresh token is : '+data.refresh_token);



      return from(Promise.all([storeAccess, storeRefresh]));
    }),
    tap(_ => {
      this.isAuthenticated.next(true);
    })
  );
}








// Potentially perform a logout operation inside your API
// or simply remove all local tokens and navigate to login
logout() {
  return this.http.post(`${this.url}/logout`, {}).pipe(
    switchMap(_ => {
      this.currentAccessToken = '';
      // Remove all stored tokens
      const deleteAccess = Preferences.remove({ key: ACCESS_TOKEN_KEY });
      const deleteRefresh = Preferences.remove({ key: REFRESH_TOKEN_KEY });
      return from(Promise.all([deleteAccess, deleteRefresh]));
    }),
    tap(_ => {
      this.isAuthenticated.next(false);
      this.router.navigateByUrl('/', { replaceUrl: true });
    })
  ).subscribe();
}

// Load the refresh token from storage
// then attach it as the header for one specific API call
getNewAccessToken() {
  const refreshToken = from(Preferences.get({ key: REFRESH_TOKEN_KEY }));
  return refreshToken.pipe(
    switchMap(token => {
      if (token && token.value) {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          })
        }
        console.log('kusha'+token.value)
        return this.http.post(`${this.url}/refresh`, {token:token.value},httpOptions);
      } else {
        // No stored refresh token
        return of(null);
      }
    })
  );
}

// Store a new access token
storeAccessToken(accessToken: any) {
  this.currentAccessToken = accessToken;
  return from(Preferences.set({ key: ACCESS_TOKEN_KEY, value: accessToken }));
}





















}