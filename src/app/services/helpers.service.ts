import { Injectable } from '@angular/core';
import * as moment from 'moment';
import numeral from 'numeral';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(private translate: TranslateService) { }
  goBack() {
    window.history.back();
  }
  renewalDays(elem) {
    if (!elem) {
      return;
    }
    if (elem.renewalAt) {
      const date1 = new Date(moment(elem.renewalAt).format('YYYY-MM-DD')),
        date2 = new Date(moment(new Date()).format('YYYY-MM-DD')),
        timeDiff = Math.abs(date2.getTime() - date1.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }
  numeral(number) {
    return numeral(number).format('0,0');
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  i18n(value, func) {
    let str;
    this.translate.get(value).subscribe((res: string) => {
      this.translate.get(func, {value: res}).subscribe((val) => {
        str = val;
      });
    });
    return str;
  }
  i18nVal(value) {
    let str;
    this.translate.get(value).subscribe((res: string) => {
      str = res;
    });
    return str;
  }
  setCallBack(chart) {
    chart.options.scales.yAxes[0].ticks.max = undefined;
    let a = 0;
    chart.options.scales.yAxes[0].ticks.callback = (value, index, values) => {
      if (index === 0) {
        a++;
      }
      if (a === 2) {
        if (values[0] === 51) {
          chart.options.scales.yAxes[0].ticks.max = 100;
        } else {
          chart.options.scales.yAxes[0].ticks.max = values[0] + values[values.length - 2];
        }
      }
      return '$ ' + value;
    };
  }
}
