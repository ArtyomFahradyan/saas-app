import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';
import {HttpRequestsService} from '../../services/http-requests.service';
import {ActivationEnd, Router} from '@angular/router';
import {HelpersService} from '../../services/helpers.service';

@Component({
  selector: 'app-invite-confirm',
  templateUrl: './invite-confirm.component.html',
  styleUrls: ['./invite-confirm.component.scss']
})
export class InviteConfirmComponent implements OnInit {
  token: string;
  submitted = false;
  errorMessage = '';
  ifErr = false;
  successAdd = false;
  newPasswordForm: FormGroup;
  constructor(private fb: FormBuilder,
              private router: Router,
              public helper: HelpersService,
              private httpService: HttpRequestsService) {
    localStorage.clear();
    router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.token = event.snapshot.queryParams.invitationToken;
      }
    });
  }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: ConfirmPasswordValidator.MatchPassword });
  }
  get f() { return this.newPasswordForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.newPasswordForm.valid) {
      this.httpService.addAdminPassword(this.token, this.newPasswordForm.value.password)
        .subscribe(data => {
          this.submitted = false;
          if (data['success']) {
            this.newPasswordForm.reset();
            localStorage.clear();
            this.successAdd = true;
            this.errorMessage = this.helper.i18n('verified', 'success_func');
            setTimeout(() => {
              this.successAdd = false;
              this.router.navigate(['/login']);
            }, 1500);
          }
        }, err => {
          this.ifErr = true;
          setTimeout(() => {
            this.ifErr = false;
          }, 2500);
          this.errorMessage = err.message;
        });
    }
  }
}
