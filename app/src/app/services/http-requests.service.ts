import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  constructor(private http: HttpClient) { }
  addAdmin(body) {
    return this.http.post(`${environment.apiUrl}/users/add-user`, body);
  }
  addTeamAdmin(body) {
    return this.http.post(`${environment.apiUrl}/users/add-user`, body);
  }
  addAdminPassword(token, password) {
    return this.http.put(`${environment.apiUrl}/users/add-user/${token}`, {password});
  }
  removeAdmin(id) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
