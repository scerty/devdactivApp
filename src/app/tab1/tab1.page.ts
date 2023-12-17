import { AuthenticationService } from './../services/authentication.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  message = '';
	constructor(private authService: AuthenticationService, private router: Router) {}



  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (res: any) => {
        
        this.message = `Hi ${res.first_name} ${res.last_name}`;
        AuthenticationService.authEmitter.emit(true);
      },
      error: err => {
        console.log(err);
        this.message = `You are not authenticated`;
        AuthenticationService.authEmitter.emit(false);
      }
    });









	


}async logout() {
  await this.authService.logout();
  this.router.navigateByUrl('/', { replaceUrl: true });
}}