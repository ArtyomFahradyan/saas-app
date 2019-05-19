import { Injectable } from '@angular/core';
import {Admin} from '../models/admin';
import {BehaviorSubject} from 'rxjs';
import {ADMIN} from '../constants/me';
@Injectable()
export class MeGlobal {
  me: Admin = ADMIN;
  dataSource = new BehaviorSubject<Admin>(this.me);
  data = this.dataSource.asObservable();

  constructor() { }

  updatedDataSelection(data: Admin) {
    this.dataSource.next(data);
  }
}
