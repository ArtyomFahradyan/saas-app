import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  showEmailVer = false;
  showErr = false;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) {
    // redirect to home if already logged in
    if (localStorage.getItem('token') && (localStorage.getItem('loggedIn') === 'true')) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.createForm();
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.userService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('isAccountOwner', data.user.isAccountOwner);
            localStorage.setItem('loggedIn', 'true');
            localStorage.removeItem('token');
            localStorage.setItem('token', data.access_token);
            this.router.navigate(['/home']);
          }
        },
        error => {
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 4000);
          this.errorMessage = error;
        });
  }
  get f() { return this.loginForm.controls; }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
