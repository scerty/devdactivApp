import { AuthService } from '../services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  secretData = null;

  constructor(private apiService: AuthService) { }

  ngOnInit() { }

  async getData() {
    this.secretData = null;

    this.apiService.user().subscribe((res: any) => {
      this.secretData = res.email;
    });
  }

  logout() {
    this.apiService.logout();
  }
}