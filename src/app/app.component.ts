import {Component} from '@angular/core';
import {DetectRouterEventsService} from './services/detect-router-events.service';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn: boolean;
  constructor(private detectRouterEventsService: DetectRouterEventsService,
              private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoggedIn = !!localStorage.getItem('loggedIn');
        console.log(this.isLoggedIn);
      }
    });
  }
}
