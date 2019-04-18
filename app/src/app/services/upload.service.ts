import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {}
  upload(formModel) {
    return this.http.post(`${environment.apiUrl}/files/`, formModel);
  }
}
