import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class IsOwnerGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    public router: Router) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.isOwner() === 'false') {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
