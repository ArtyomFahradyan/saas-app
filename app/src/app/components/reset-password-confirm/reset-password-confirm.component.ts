import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss']
})
export class ResetPasswordConfirmComponent implements OnInit {
  token: string;
  message = '';
  showErr = false;
  showEmailVer = false;
  submitted = false;
  resetPasswordForm: FormGroup;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.token = localStorage.getItem('tokenVal');
  }
  createForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: ConfirmPasswordValidator.MatchPassword });
  }
  get f() { return this.resetPasswordForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.userService.resetPasswordConfirm(this.token, this.f.password.value)
      .subscribe(
        data => {
          this.showEmailVer = true;
          setTimeout(() => {
            this.showEmailVer = false;
            this.router.navigate(['/login']);
          }, 4000);
          this.message = 'Your password was reset, you can login to your account.';
          this.resetPasswordForm.reset();
          this.submitted = false;
        },
        error => {
          this.message = error;
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 4000);
        }
      );
  }
}
