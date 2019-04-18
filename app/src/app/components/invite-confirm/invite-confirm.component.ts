import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';
import {HttpRequestsService} from '../../services/http-requests.service';
import {Router} from '@angular/router';

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
              private httpService: HttpRequestsService) { }

  ngOnInit() {
    this.token = localStorage.getItem('tokenVal');
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
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('token');
            localStorage.removeItem('tokenVal');
            this.successAdd = true;
            this.errorMessage = 'Successfully verified';
            setTimeout(() => {
              this.successAdd = false;
              this.router.navigate(['/login']);
            }, 4000);
          }
          console.log(data);
        }, err => {
          this.ifErr = true;
          setTimeout(() => {
            this.ifErr = false;
          }, 4000);
          this.errorMessage = err;
        });
    }
  }
}
