import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }

  renewalDate (date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD');
    }
  }
  goBack() {
    window.history.back();
  }
}
