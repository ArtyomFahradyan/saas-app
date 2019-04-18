import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import { first } from 'rxjs/operators';
import {AlertService} from '../../services/alert.service';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';
import {Router} from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap';
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
  showErr = false;
  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router,
              private alertService: AlertService) { }

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
    this.userService.signup(this.signupForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.signupForm.reset();
          this.submitted = false;
          this.stepOneModal.hide();
          this.stepTwoModal.show();
        },
        error => {
          this.showErr = true;
          setTimeout(() => {
            this.showErr = false;
          }, 3000);
          this.errorMessage = error;
        });
  }
  get f() { return this.signupForm.controls; }
  createForm() {
    this.signupForm = this.fb.group({
        company: ['', Validators.required],
        team: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
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
