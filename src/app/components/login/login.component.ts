import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {NavigationEnd, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {HelpersService} from '../../services/helpers.service';
import {TranslateService} from '@ngx-translate/core';
import {EMAIL_PATTERN} from '../../constants/patterns';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  disabled = false;
  errorMessage = '';
  showEmailVer = false;
  showErr = false;
  constructor(private fb: FormBuilder,
              public helper: HelpersService,
              private translate: TranslateService,
              private userService: UserService,
              private router: Router) {
    localStorage.clear();
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url.includes('Token')) {
        // Navigation started.
        const routerArr = event.url.split('='),
              token = routerArr[1];
        if (event.url.includes('verifyToken')) {
          this.userService.emailVerification(token).subscribe(data => {
            this.errorMessage = this.helper.i18n('email', 'successfully_verified_func');
            this.showEmailVer = true;
            setTimeout(() => {
              this.showEmailVer = false;
            }, 1500);
          }, err => {
            this.translate.get(err.message).subscribe((res: string) => {
              this.errorMessage = res;
            });
            this.showErr = true;
            setTimeout(() => {
              this.showErr = false;
            }, 2500);
          });
        }
      }
    });
    // redirect to home if already logged in
    if (localStorage.getItem('token') && (localStorage.getItem('loggedIn') === 'true')) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit() {
    localStorage.clear();
    this.createForm();
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.disabled = true;
    this.userService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(data => {
          this.disabled = false;
          if (data) {
            localStorage.setItem('isAccountOwner', data.user.isAccountOwner);
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('token', data.access_token);
            this.router.navigate(['dashboard']);
          }
        },
        error => {
          this.disabled = false;
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 2500);
          this.translate.get(error.message).subscribe((res: string) => {
            this.errorMessage = res;
          });
        });
  }
  get f() { return this.loginForm.controls; }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
