import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(
    private authService: AuthService,
    public router: Router) {}

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

@Injectable()
export class AuthGuardForHome implements CanActivate {
  constructor(private authService: AuthService,
              public router: Router) {  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
