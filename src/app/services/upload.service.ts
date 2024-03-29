import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Attachment} from '../models/attachment';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) {}
  upload(formModel): Observable<Attachment> {
    return this.http.post<Attachment>(`${environment.apiUrl}/files/`, formModel);
  }
}
