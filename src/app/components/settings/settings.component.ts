import {Component, OnInit, ViewChild} from '@angular/core';

import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Admin} from '../../models/admin';
import {HttpRequestsService} from '../../services/http-requests.service';
import {ConfirmPasswordValidator} from '../../confirm-password.validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('addAdminModal') public addAdminModal: ModalDirective;
  @ViewChild('deleteAdminModal') public deleteAdminModal: ModalDirective;

  admins: Admin[] = [];
  addAdminForm: FormGroup;
  submitted = false;
  errorMessage = '';
  ifErr = false;
  isAccountOwner = true;
  successAdd = false;
  admin: Admin = {
      firstName: '',
      lastName: '',
      email: '',
      _id: ''
  };
  deletedIndex = 0;
  defLimit = {
      offset: 0,
      size: 5
  };
  adminsCount = 0;
  constructor(private userService: UserService,
              private fb: FormBuilder,
              private httpRequests: HttpRequestsService) { }

  ngOnInit() {
    if (localStorage.getItem('isAccountOwner') === 'false') {
      this.isAccountOwner = false;
    } else {
      this.getAdmins();
    }
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
  getAdmins() {
    this.userService.getAdmins(this.defLimit.offset, this.defLimit.size)
        .subscribe(data => {
          this.adminsCount = data['count'];
          this.admins = this.admins.concat(data);
          console.log(data, this.admins);

        });
  }
  loadMoreAdmins() {
      this.defLimit.offset += 5;
      this.getAdmins();
  }
  getTeams() {
    // this.userService.getTeams()
    //     .subscribe()
  }
  addAdmin() {
    this.submitted = true;

    console.log(this.addAdminForm.value, this.addAdminForm.valid);
    if (this.addAdminForm.valid) {
      this.httpRequests.addAdmin(this.addAdminForm.value)
        .subscribe(data => {
          this.submitted = false;
          this.successAdd = true;
          setTimeout(() => {
            this.successAdd = false;
            this.hideAddAdminModal();
          }, 4000);
          this.errorMessage = 'Admin successfully add';
          console.log(this.errorMessage);
        }, err => {
          this.ifErr = true;
          setTimeout(() => {
            this.ifErr = false;
          }, 4000);
          this.errorMessage = err;
        });
    }
  }
  deleteAdmin() {
    this.httpRequests.removeAdmin(this.admin._id)
      .subscribe(data => {
        this.successAdd = true;
        this.admins.splice(this.deletedIndex, 1);
        setTimeout(() => {
          this.successAdd = false;
          this.hideDeleteAdminModal();
        }, 4000);
        this.errorMessage = 'Admin successfully removed';
        console.log(data);
      }, err => {
        this.ifErr = true;
        setTimeout(() => {
          this.ifErr = false;
        }, 4000);
        this.errorMessage = err;
      });
  }
  sendEndDate(event) {
    console.log(event.target.value);
  }
  hideAddAdminModal() {
    this.addAdminForm.reset();
    this.addAdminModal.hide();
  }
  showAddAdminModal() {
      this.addAdminModal.show();
  }
  showDeleteAdminModal(admin, index) {
    this.deletedIndex = index;
    this.deleteAdminModal.show();
    this.admin = admin;
  }
  hideDeleteAdminModal() {
      this.deleteAdminModal.hide();
  }
}
