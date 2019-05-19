import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {Contract} from '../models/contract';

@Injectable()
export class UserService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  signup(user) {
    return this.http.post<any>(`${environment.apiUrl}/auth/signup/`, user, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login/`, { email, password }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  emailVerification(token: string) {
    return this.http.post(`${environment.apiUrl}/auth/verify/`, { token });
  }

  resetPassword(email: string) {
    return this.http.post(`${environment.apiUrl}/auth/reset-password/`, { email });
  }

  resetPasswordConfirm(token: string, password: string) {
    return this.http.put(`${environment.apiUrl}/auth/reset-password/${token}`, { password });
  }

  logout() {
    return this.http.get(`${environment.apiUrl}/auth/logout/`);
  }
  getServices(offset, size, searchTerm, platform, dir) {
    return this.http.get(`${environment.apiUrl}/contracts?offset=${offset}&size=${size}&sort=${platform}&dir=${dir}` + `${searchTerm ? '&q=' + searchTerm : ''}`);
  }
  getTeams(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teams`);
  }
  getContracts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/contracts`);
  }
  getContract(id): Observable<Contract> {
    return this.http.get<Contract>(`${environment.apiUrl}/contracts/${id}`);
  }
  sendNotes(id, notes, customField, notifyAdmin): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/contracts/${id}`, {
      notes,
      customField,
      notifyAdmin
    });
  }
  getAdmins(offset, size, searchTerm, sortBy, dir): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users?offset=${offset}&size=${size}&sort=${sortBy}&dir=${dir}` + `${searchTerm ? '&q=' + searchTerm : ''}`);
  }
}
