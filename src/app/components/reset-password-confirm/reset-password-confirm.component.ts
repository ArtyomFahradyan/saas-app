import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';
import {ActivationEnd, Router} from '@angular/router';
import {HelpersService} from '../../services/helpers.service';

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
              public helper: HelpersService,
              private userService: UserService,
              private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.token = event.snapshot.queryParams.resetToken;
      }
    });
  }

  ngOnInit() {
    this.createForm();
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
          }, 2500);
          this.message = this.helper.i18nVal('reset_pass_confirm');
          this.resetPasswordForm.reset();
          this.submitted = false;
        },
        error => {
          this.message = error.message;
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 1500);
        }
      );
  }
}
