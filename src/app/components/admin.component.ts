import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Admin} from '../models/admin';
import {MeGlobal} from './me';
import {HttpRequestsService} from '../services/http-requests.service';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {ErrorMessage} from '../services/errorInterceptorMessage';
import $ from 'jquery';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'admin',
  styleUrls: [ './admin.component.scss' ],
  templateUrl: './admin.component.html'
})

export class AdminComponent {
  me: Admin = <Admin>{};
  private dataSource = new BehaviorSubject(new Date());
  data = this.dataSource.asObservable();
  constructor(private router: Router,
              public errorMessage: ErrorMessage,
              public meGlobal: MeGlobal,
              private translate: TranslateService,
              private httpRequests: HttpRequestsService) {
    translate.setDefaultLang('en');
    this.getMe();
    this.updatedDataSelection(new Date());
    this.scroll();
  }
  updatedDataSelection(data: Date) {
    this.dataSource.next(data);
  }
  getMe() {
    this.httpRequests.getMe()
      .pipe(map(val => val['user']))
      .subscribe(data => {
        this.meGlobal.updatedDataSelection(data);
        this.meGlobal.me = data;
      });
  }
  scroll() {
    $(document).on('scroll', function() {
      const scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
  }
  toTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
    return false;
  }
}
