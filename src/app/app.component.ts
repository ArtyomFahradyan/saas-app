import {Component} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ErrorMessage} from './services/errorInterceptorMessage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router,
              public errorMessages: ErrorMessage,
              private translate: TranslateService) {
    translate.setDefaultLang('en');
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.url.includes('Token')) {
        if (event.url.includes('verifyToken')) {
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('token');
          localStorage.removeItem('isAccountOwner');
        }
      }
    });
  }
  closePopUp() {
    const div = document.getElementById('popup');
    if (div) {
      div.classList.remove('show-elem');
    }
  }
}
