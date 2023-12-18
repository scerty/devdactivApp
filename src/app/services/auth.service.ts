import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
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
  isAuthenticated: BehaviorSubject<String> = new BehaviorSubject<String>('');
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
      this.isAuthenticated.next('true');
     // console.log(this.isAuthenticated.next);
      
      
      
    } else {
      this.isAuthenticated.next('false');
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


      //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST 

      
      console.log('access token is : '+data.token);
      console.log('refresh token is : '+data.refresh_token);
      //console.log(this.isAuthenticated);


      //TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST 






      return from(Promise.all([storeAccess, storeRefresh]));
    }),
    tap(_ => {
      this.isAuthenticated.next('true');
    })
  );
}








// Potentially perform a logout operation inside your API
// or simply remove all local tokens and navigate to login
logout() {
  this.removeAPITOKEN().subscribe(
    () => {
      this.cleanUpAfterLogout();
    },
    error => {
      console.error('Error during logout:', error);
      // Handle errors or perform additional actions as needed
    }
  );
}

removeAPITOKEN() {
  const refreshTokentodelete = from(Preferences.get({ key: REFRESH_TOKEN_KEY }));

  return refreshTokentodelete.pipe(
    switchMap(token => {
      if (token && token.value) {
        const httpOptions = {
          withCredentials: true,
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          })
        };

        return this.http.post(`${this.url}/logout`, { app: 'from ionic tabs' }, httpOptions).pipe(
          catchError(error => {
            console.error('Error revoking token on the server:', error);
            // Handle errors or perform additional actions as needed
            return throwError(error);
          })
        );
      } else {
        return of(null);
      }
    }),
    finalize(() => {
      // Additional cleanup or actions to perform regardless of success or error
      console.log('Cleanup after removing token from API');
    })
  );
}

cleanUpAfterLogout() {
  this.currentAccessToken = '';
  const deleteAccess = Preferences.remove({ key: ACCESS_TOKEN_KEY });
  const deleteRefresh = Preferences.remove({ key: REFRESH_TOKEN_KEY });

  from(Promise.all([deleteAccess, deleteRefresh])).subscribe(
    () => {
      this.isAuthenticated.next('false');
      this.router.navigateByUrl('/', { replaceUrl: true });
    },
    error => {
      console.error('Error deleting tokens:', error);
      // Handle errors or perform additional actions as needed
    }
  );
}




// Load the refresh token from storage
// then attach it as the header for one specific API call
getNewAccessToken() {
  const refreshToken = from(Preferences.get({ key: REFRESH_TOKEN_KEY }));
  return refreshToken.pipe(
    switchMap(token => {
      if (token && token.value) {
        const httpOptions = {
          withCredentials: true,
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`
          })




        }
        console.log('kusha'+token.value)
        return this.http.post(`${this.url}/refresh`, {app:'from ionic tabs'},httpOptions);
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