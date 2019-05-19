import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {HelpersService} from '../../services/helpers.service';
import {EMAIL_PATTERN} from '../../constants/patterns';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  emailForm: FormGroup;
  message = '';
  showErr = false;
  showEmailVer = false;
  submitted = false;
  constructor(private fb: FormBuilder,
              public helper: HelpersService,
              private userService: UserService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]]
    });
  }
  get f() { return this.emailForm.controls; }
  onSubmit () {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    }
    this.userService.resetPassword(this.f.email.value)
      .subscribe(
        data => {
          this.showEmailVer = true;
          setTimeout(() => {
            this.showEmailVer = false;
          }, 1500);
          this.message = this.helper.i18n(this.f.email.value, 'reset_pass_message');
          this.emailForm.reset();
          this.submitted = false;
        },
        error => {
          this.message = error.message;
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 2500);
        }
      );
  }
}
