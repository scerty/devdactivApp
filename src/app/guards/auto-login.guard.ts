import { AuthService } from '../services/auth.service';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanLoad, CanLoadFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
class AutoGuard  {
	constructor(private authService: AuthService, private route: Router ) {}

	canActivate(
    route: ActivatedRouteSnapshot,
    state:RouterStateSnapshot
  ):Observable<boolean> {
		return this.authService.isAuthenticated.pipe(
			filter((val) => val !== null), // Filter out initial Behaviour subject value
			take(1), // Otherwise the Observable doesn't complete!
			map((isAuthenticated) => {
        console.log('Found previous token, automatic login');
        if (isAuthenticated) {
          // Directly open inside area
          this.route.navigateByUrl('/tabs/tab1', { replaceUrl: true });
          return false; // Return false instead of void
        } else {
          // Simply allow access to the login
          return true;
        }
      })
		);
	}
}

export const isAutoGuard:CanActivateFn=(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean> =>{
  return inject(AutoGuard).canActivate(route,state)


  
}