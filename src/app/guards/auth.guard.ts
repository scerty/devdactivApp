
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanLoad {
	constructor(private authService: AuthService, private router: Router) {}

	canLoad(): Observable<boolean> {
		return this.authService.isAuthenticated.pipe(
			filter((val) => val !== ''), // Filter out initial Behaviour subject value
			take(1), // Otherwise the Observable doesn't complete!
			map((isAuthenticated) => {
				if (isAuthenticated==='true') {
					
					console.log('5555555555555555555555555555555 test comeing frome auth guard');
					console.log(isAuthenticated);
					
					return true;
				} else {
					console.log('44444444444444444444444');
					console.log(isAuthenticated);
					
					this.router.navigateByUrl('/login');
					//console.log('ksha kaseks');
					
					return false;
				}
			})
		);
	}
}