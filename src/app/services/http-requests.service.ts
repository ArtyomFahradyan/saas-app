import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Admin} from '../models/admin';
import {Team} from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  constructor(private http: HttpClient) { }
  addAdmin(body): Observable<Admin> {
    return this.http.post<Admin>(`${environment.apiUrl}/users/add-user`, body);
  }
  editAdmin(body, id): Observable<Admin> {
    return this.http.put<Admin>(`${environment.apiUrl}/users/${id}`, body);
  }
  addTeam(name): Observable<any> {
    return this.http.post(`${environment.apiUrl}/teams`, {
      name
    });
  }
  deleteTeam(id): Observable<Team> {
    return this.http.delete<Team>(`${environment.apiUrl}/teams/${id}`);
  }
  addTeamAdmin(body, team): Observable<Admin> {
    return this.http.post<Admin>(`${environment.apiUrl}/team-members`, {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      team,
    });
  }
  editTeamAdmin(body, team, id): Observable<Admin> {
    return this.http.put<Admin>(`${environment.apiUrl}/team-members/${id}`, {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      team,
    });
  }
  setFiscalYear(fiscalYearStartAt) {
    return this.http.patch(`${environment.apiUrl}/accounts/fiscal-year`, {
      fiscalYearStartAt
    });
  }
  removeTeamAdmin(id) {
    return this.http.delete(`${environment.apiUrl}/team-members/${id}`);
  }
  getTeamAdmins(id, offset, size, searchTerm, sortBy, dir): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${environment.apiUrl}/team-members/team/${id}?offset=${offset}&size=${size}&sort=${sortBy}&dir=${dir}` + `${searchTerm ? '&q=' + searchTerm : ''}`);
  }
  addAdminPassword(token, password) {
    return this.http.put(`${environment.apiUrl}/users/add-user/${token}`, {password});
  }
  removeAdmin(id) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
  resendEmailForAdmin(id) {
    return this.http.get(`${environment.apiUrl}/users/${id}/resend-mail`);
  }
  getMe(): Observable<Admin> {
    return this.http.get<Admin>(`${environment.apiUrl}/users/me`);
  }
  getTeams(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teams/account/${id}`);
  }
  deleteContract(id) {
    return this.http.delete(`${environment.apiUrl}/contracts/${id}`);
  }
  expirationreminderDate(date) {
    return this.http.put(`${environment.apiUrl}/accounts/reminder`, {
      reminder: date
    });
  }
  renevalClosest(offset): Observable<any> {
    return this.http.get(`${environment.apiUrl}/accounts/dashboard?offset=${offset}`);
  }
  download(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}/files/${id}`);
  }
}
