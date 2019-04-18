import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  constructor(
              private userService: UserService,
              private alertService: AlertService,
              private router: Router) {}
  ngOnInit() {}
  logOut() {
    this.userService.logout()
      .subscribe(
        data => {
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('token');

          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error.error.message);
        });
  }
}
