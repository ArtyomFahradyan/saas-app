import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import $ from 'jquery';
import {MeGlobal} from '../me';
import {Admin} from '../../models/admin';
import {ModalDirective} from 'ngx-bootstrap';
import {ADMIN} from '../../constants/me';
import {MENU_LIST} from '../../constants/menueList';
@Component({
  selector: 'left-navbar',
  templateUrl: './left-navbar.component.html',
  styleUrls: ['./left-navbar.component.scss']
})
export class LeftNavbarComponent implements OnInit {
  @ViewChild('logOutModal') logOutModal: ModalDirective;
  link: string;
  me: Admin = <Admin>{};
  isOwner = true;
  menuList = MENU_LIST;
  constructor(private router: Router,
              public meGlobal: MeGlobal,
              private userService: UserService) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.link = event.url;
      }
    });
  }

  ngOnInit() {
    this.meGlobal.data.subscribe(data => {
      if (data.account) {
        this.me = data;
      }
    });
    this.isOwner = localStorage.getItem('isAccountOwner') === 'true';
  }
  showLogOutModal() {
    this.logOutModal.show();
  }
  logOut() {
    this.userService.logout()
      .subscribe(
        data => {
          this.meGlobal.updatedDataSelection(ADMIN);
          localStorage.clear();
          this.router.navigate(['/login']);
        });
  }
  hideNavBar(event) {
      event.preventDefault();
      $('#imgCircle').toggleClass('user-circle-toggled');
      $('.container-fluid').toggleClass('container-fluid-padding');
      $('body').toggleClass('sidebar-toggled');
      $('.sidebar').toggleClass('toggled');
  }
}
