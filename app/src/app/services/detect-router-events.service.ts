import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {NavigationStart, Router} from '@angular/router';

@Injectable()
export class DetectRouterEventsService {
  token: string;
  constructor(private userService: UserService,
              private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.url.includes('Token')) {
        // Navigation started.
        const routerArr = event.url.split('=');
        this.token = routerArr[1];
        localStorage.setItem('tokenVal', this.token);
        if (event.url.includes('verifyToken')) {
          this.userService.emailVerification(this.token).subscribe(
            data => {
              this.router.navigate(['/login']);
            });
        } else if (event.url.includes('resetToken')) {
          this.router.navigate(['/reset-password/confirm']);
        } else if (event.url.includes('invite/confirm')) {
          if (localStorage.getItem('loggedIn')) {
            localStorage.removeItem('loggedIn');
          }
          this.router.navigate(['/invite/confirm']);
        }
      }
    });
  }
}
