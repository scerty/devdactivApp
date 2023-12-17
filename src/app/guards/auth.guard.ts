import { AuthenticationService } from './../services/authentication.service';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanLoad, CanLoadFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
class AuthGuard  {
	constructor(private authService: AuthenticationService, private route: Router ) {}

	canActivate(
    route: ActivatedRouteSnapshot,
    state:RouterStateSnapshot
  ):Observable<boolean> {
		return this.authService.isAuthenticated.pipe(
			filter((val) => val !== null), 
			take(1), 
			map((isAuthenticated) => {
				if (isAuthenticated) {
					return true;
          //console.log('true')

				} else {
					this.route.navigateByUrl('/login');
					return false;
          //console.log('false')
				}
			})
		);
	}
}

export const isAuthenticatedGuard:CanActivateFn=(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean> =>{
  return inject(AuthGuard).canActivate(route,state)


  
}