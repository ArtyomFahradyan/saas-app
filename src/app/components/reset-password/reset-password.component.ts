import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AlertService} from '../../services/alert.service';

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
              private userService: UserService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
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
          }, 4000);
          this.message = `A confirmation email has been sent to you at ${this.f.email.value}. ` +
            `Please click on the link in that email to activate your account.`;
          this.emailForm.reset();
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
