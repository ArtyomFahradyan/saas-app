import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Admin} from '../../models/admin';
import {MeGlobal} from '../me';
import {TranslateService} from '@ngx-translate/core';
import {HelpersService} from '../../services/helpers.service';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  breadcrumbs = [];
  me: Admin = <Admin>{};
  constructor(private router: Router,
              public helper: HelpersService,
              private translate: TranslateService,
              public meGlobal: MeGlobal) {
    translate.setDefaultLang('en');
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = event.url.split('/');
      }
    });
  }

  ngOnInit() {
    this.meGlobal.data.subscribe(data => {
      if (data.account) {
        this.me = data;
      }
    });
  }
  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
