import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import { first } from 'rxjs/operators';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';
import {ModalDirective} from 'ngx-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {HelpersService} from '../../services/helpers.service';
import {EMAIL_PATTERN} from '../../constants/patterns';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @ViewChild('stepOneModal') public stepOneModal: ModalDirective;
  @ViewChild('stepTwoModal') public stepTwoModal: ModalDirective;

  signupForm: FormGroup;
  submitted = false;
  teams = [];
  errorMessage = '';
  param = {
    value: ''
  };
  showErr = false;
  disabled = false;
  hrefs = {
    service: 'https://saastracked.com/terms-of-service/',
    privacy: 'https://saastracked.com/privacy-policy/'
  };
  constructor(private fb: FormBuilder,
              public helper: HelpersService,
              private translate: TranslateService,
              private userService: UserService) {  }

  ngOnInit() {
    setTimeout(() => {
      this.stepOneModal.show();
    }, 100);
    this.createForm();
    this.getTeams();
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    this.disabled = true;
    this.userService.signup(this.signupForm.value)
      .pipe(first())
      .subscribe(data => {
          this.disabled = true;
          this.disabled = false;
          this.signupForm.reset();
          this.submitted = false;
          this.stepOneModal.hide();
          this.stepTwoModal.show();
        },
        error => {
          this.disabled = false;
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 2500);
          this.errorMessage = error.message;
        });
  }
  get f() { return this.signupForm.controls; }
  createForm() {
    this.signupForm = this.fb.group({
        company: ['', Validators.required],
        team: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: ConfirmPasswordValidator.MatchPassword });
  }
  getTeams() {
    this.userService.getTeams()
      .subscribe(data => {
        this.teams = data;
      });
  }
}
