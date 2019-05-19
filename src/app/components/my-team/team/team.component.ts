import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {Admin} from '../../../models/admin';
import {HelpersService} from '../../../services/helpers.service';
import {HttpRequestsService} from '../../../services/http-requests.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {EMAIL_PATTERN} from '../../../constants/patterns';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @ViewChild('addAdminModal') public addAdminModal: ModalDirective;
  @ViewChild('deleteAdminModal') public deleteAdminModal: ModalDirective;
  admins: Admin[] = [];
  adminsCount = 0;
  disabled = false;
  spinner = false;
  deleteAdminIndex = 0;
  searchTerm = '';
  dir: 'asc' | 'desc' = 'asc';
  sortByTerm: 'fName' | 'lName' | 'email' = 'fName';
  addAdminForm: FormGroup;
  submitted = false;
  errorMessage = '';
  ifErr = false;
  teamId = '';
  successAdd = false;
  admin: Admin = null;
  defPaginate = {
    offset: 0,
    size: 10
  };
  globPage = 1;
  pages = [];
  constructor(public helpers: HelpersService,
              private activatedRoute: ActivatedRoute,
              public translate: TranslateService,
              private router: Router,
              private httpRequests: HttpRequestsService,
              private fb: FormBuilder) {
    this.activatedRoute.params.subscribe( () => {
      this.teamId = this.activatedRoute.snapshot.params['teamId'];
      this.getAdmins();
    });
  }
  ngOnInit() {
    this.createForm();
  }
  get f() { return this.addAdminForm.controls; }
  createForm(admin = null) {
    if (admin) {
      this.addAdminForm = this.fb.group({
        firstName: [this.admin.firstName, Validators.required],
        lastName: [this.admin.lastName, Validators.required],
        email: [this.admin.email, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      });
    } else {
      this.addAdminForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      });
    }
  }
  hideAddAdminModal() {
    this.admin = null;
    this.submitted = false;
    this.addAdminForm.reset();
    this.addAdminModal.hide();
  }
  selectSize(event) {
    this.defPaginate.size = +event.target.value;
    this.defPaginate.offset = 0;
    this.globPage = 1;
    this.getAdmins();
  }
  getAdmins() {
    this.httpRequests.getTeamAdmins(this.teamId, this.defPaginate.offset, this.defPaginate.size, this.searchTerm, this.sortByTerm, this.dir)
      .subscribe(data => {
        if (data) {
          this.adminsCount = data['count'];
          this.getPages(this.adminsCount);
          this.admins = data['teamMembers'];
        }
      });
  }
  sortBy(by) {
    if (this.sortByTerm === by && this.dir === 'desc') {
      this.dir = 'asc';
    } else if (this.sortByTerm === by && this.dir === 'asc') {
      this.dir = 'desc';
    }
    if (this.sortByTerm !== by) {
      this.dir = 'asc';
    }
    this.sortByTerm = by;
    this.getAdmins();
  }
  search(event) {
    this.defPaginate.offset = 0;
    this.searchTerm = event.target.value;
    this.getAdmins();
  }
  getPages(count) {
    this.pages.length = 0;
    const pages = Math.ceil(count / this.defPaginate.size);
    for (let i = 0; i < pages; i++) {
      this.pages.push(i);
    }
  }
  changePage(page) {
    if (this.globPage === page) {
      return 0;
    }
    if (page < 1 || page > this.pages.length) {
      return 0;
    }
    this.globPage = page;
    this.defPaginate.offset = page - 1;
    this.getAdmins();
  }
  showAddAdminModal(admin = null, index = null) {
    if (admin) {
      this.deleteAdminIndex = index;
      this.admin = admin;
      this.createForm(admin);
    }
    this.addAdminModal.show();
  }
  showDeleteAdminModal(admin, index) {
    this.deleteAdminIndex = index;
    this.deleteAdminModal.show();
    this.admin = admin;
  }
  hideDeleteAdminModal() {
    this.disabled = false;
    this.admin = null;
    this.deleteAdminModal.hide();
  }
  addAdmin() {
    this.submitted = true;
    if (this.addAdminForm.valid) {
      this.disabled = true;
      this.spinner = true;
      if (!this.admin) {
        this.httpRequests.addTeamAdmin(this.addAdminForm.value, this.teamId)
          .subscribe(data => {
            this.spinner = false;
            if (this.admins.length < this.defPaginate.size) {
              this.admins.push(data);
            } else {
              this.getPages(this.adminsCount);
            }
            this.adminsCount++;
            this.success('successfully_add');
          }, err => {
            this.error(err.message);
          });
      } else {
        this.httpRequests.editTeamAdmin(this.addAdminForm.value, this.teamId, this.admin._id)
          .subscribe(data => {
            this.spinner = false;
            this.admins[this.deleteAdminIndex] = data;
            this.success('successfully_edited');
          }, err => {
            this.error(err.message);
          });
      }
    }
  }
  deleteAdmin() {
    this.spinner = true;
    this.disabled = true;
    this.httpRequests.removeTeamAdmin(this.admin._id)
      .subscribe(data => {
        this.spinner = false;
        this.successAdd = true;
        this.adminsCount--;
        this.admins.splice(this.deleteAdminIndex, 1);
        setTimeout(() => {
          this.successAdd = false;
          this.hideDeleteAdminModal();
        }, 1500);
        this.errorMessage = this.helpers.i18n('admin', 'successfully_removed');
      }, err => {
        this.spinner = false;
        this.disabled = false;
        this.ifErr = true;
        setTimeout(() => {
          this.ifErr = false;
        }, 2500);
        this.errorMessage = err.message;
      });
  }
  success(message: string) {
    this.submitted = false;
    this.successAdd = true;
    setTimeout(() => {
      this.disabled = false;
      this.successAdd = false;
      this.hideAddAdminModal();
    }, 1500);
    this.errorMessage = this.helpers.i18n('admin', message);
  }
  error(message: string) {
    this.disabled = false;
    this.spinner = false;
    this.ifErr = true;
    setTimeout(() => {
      this.ifErr = false;
    }, 2500);
    this.errorMessage = message;
  }
}
