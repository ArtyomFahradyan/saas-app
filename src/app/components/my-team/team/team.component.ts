import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {Admin} from '../../../models/admin';
import {HelpersService} from '../../../services/helpers.service';
import {HttpRequestsService} from '../../../services/http-requests.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @ViewChild('addAdminModal') public addAdminModal: ModalDirective;
  @ViewChild('deleteAdminModal') public deleteAdminModal: ModalDirective;
  admins: Admin[] = [];
  addAdminForm: FormGroup;
  submitted = false;
  errorMessage = '';
  ifErr = false;
  successAdd = false;
  admin: Admin = {
    firstName: '',
    lastName: '',
    email: '',
    _id: ''
  };
  constructor(public helpers: HelpersService,
              private httpRequests: HttpRequestsService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }
  get f() { return this.addAdminForm.controls; }
  createForm() {
    this.addAdminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    });
  }
  hideAddAdminModal() {
    this.addAdminForm.reset();
    this.addAdminModal.hide();
  }
  showAddAdminModal(whichModal) {
    if (whichModal === 'report') {

    } else if (whichModal === 'commit') {

    }
    this.addAdminModal.show();
  }
  showDeleteAdminModal(admin) {
    this.deleteAdminModal.show();
    this.admin = admin;
  }
  hideDeleteAdminModal() {
    this.deleteAdminModal.hide();
  }
  loadMoreAdmins() {

  }
  addAdmin() {
    this.submitted = true;
    // this.httpRequests.addTeamAdmin()
    //   .subscribe(data => {
    //      this.submitted = false;
    //    });
  }
  deleteAdmin() {

  }
}
