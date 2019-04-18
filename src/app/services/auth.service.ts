import {Injectable} from '@angular/core';

@Injectable()

export class AuthService {
  public isLoggedIn(): boolean {
      return (localStorage.getItem('token') && (localStorage.getItem('loggedIn') === 'true'));
  }
}
