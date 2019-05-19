import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Admin} from '../../models/admin';
import {HttpRequestsService} from '../../services/http-requests.service';
import {map} from 'rxjs/operators';
import {MeGlobal} from '../me';
import {HelpersService} from '../../services/helpers.service';
import {MONTHS} from '../../constants/settings';
import {EMAIL_PATTERN} from '../../constants/patterns';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('addAdminModal') public addAdminModal: ModalDirective;
  @ViewChild('deleteAdminModal') public deleteAdminModal: ModalDirective;
  @ViewChild('resendEmailModal') public resendEmailModal: ModalDirective;

  admins: Admin[] = [];
  addAdminForm: FormGroup;
  submitted = false;
  disabled = false;
  spinner = false;
  errorMessage = '';
  dateMessage = '';
  ifDateErr = false;
  ifChangeDateErr = false;
  showDateMessage = false;
  showChangeDateMessage = false;
  ifErr = false;
  successAdd = false;
  admin: Admin = null;
  adminMe: Admin = null;
  deletedIndex = 0;
  adminsCount = 0;
  date = 3;
  fiscalYear;
  defPaginate = {
    offset: 0,
    size: 10
  };
  globPage = 1;
  pages = [];
  deleteAdminIndex = 0;
  searchTerm = '';
  dir: 'asc' | 'desc' = 'asc';
  sortByTerm = 'fName';
  months = MONTHS;
  endDates = [['tree', 3], ['two', 2], ['one', 1]];
  constructor(private userService: UserService,
              public helper: HelpersService,
              public meGlobal: MeGlobal,
              private fb: FormBuilder,
              private httpRequests: HttpRequestsService) {  }

  ngOnInit() {
    this.getAdmins();
    this.meGlobal.data.subscribe(data => {
      this.adminMe = data;
      if (data.account.reminder) {
        this.fiscalYear = data.account.fiscalYearStartAt;
        this.date = data.account.reminder;
      }
    });
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
  selectSize(event) {
    this.defPaginate.size = +event.target.value;
    this.defPaginate.offset = 0;
    this.globPage = 1;
    this.getAdmins();
  }
  fiscalYearOnchange(event) {
    this.httpRequests.setFiscalYear(+this.fiscalYear)
      .subscribe(data => {
        this.meGlobal.me.account.fiscalYearStartAt = +this.fiscalYear;
        this.meGlobal.updatedDataSelection(this.meGlobal.me);
        this.showChangeDateMessage = true;
        setTimeout(() => {
          this.showChangeDateMessage = false;
        }, 1500);
        this.dateMessage = this.helper.i18n('date', 'successfully_changed');
      }, err => {
        this.dateMessage = err.message;
        this.ifChangeDateErr = true;
        setTimeout(() => {
          this.ifChangeDateErr = false;
        }, 2500);
      });
  }
  getDate() {
    this.httpRequests.getMe()
      .pipe(map(val => val['user'].account.reminder))
      .subscribe(data => {
        this.date = data;
      });
  }
  getAdmins() {
    this.userService.getAdmins(this.defPaginate.offset, this.defPaginate.size, this.searchTerm, this.sortByTerm, this.dir)
        .subscribe(data => {
          if (data) {
            this.adminsCount = data['count'];
            this.getPages(this.adminsCount);
            this.admins = data['admins'];
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
  addAdmin() {
    this.submitted = true;
    if (this.addAdminForm.valid) {
      this.disabled = true;
      this.spinner = true;
      if (!this.admin) {
        this.httpRequests.addAdmin(this.addAdminForm.value)
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
        this.httpRequests.editAdmin(this.addAdminForm.value, this.admin._id)
          .subscribe(data => {
            this.spinner = false;
            if (this.deleteAdminIndex) {
              this.admins[this.deleteAdminIndex] = data;
            } else {
              this.meGlobal.updatedDataSelection(data);
            }
            this.success('successfully_edited');
          }, err => {
            this.error(err.message);
          });
      }
    }
  }
  success(message: string) {
    this.submitted = false;
    this.successAdd = true;
    setTimeout(() => {
      this.disabled = false;
      this.successAdd = false;
      this.hideAddAdminModal();
    }, 1500);
    this.errorMessage = this.helper.i18n('admin', message);
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
  deleteAdmin() {
    this.disabled = true;
    this.spinner = true;
    this.httpRequests.removeAdmin(this.admin._id)
      .subscribe(data => {
        this.spinner = false;
        this.successAdd = true;
        this.adminsCount--;
        this.admins.splice(this.deletedIndex, 1);
        setTimeout(() => {
          this.successAdd = false;
          this.hideDeleteAdminModal();
        }, 1500);
        this.errorMessage = this.helper.i18n('admin', 'successfully_removed');
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
  sendEndDate(event) {
    this.httpRequests.expirationreminderDate(+event.target.value)
      .subscribe(data => {
        this.meGlobal.me.account['reminder'] = <number>event.target.value;
        this.showDateMessage = true;
        setTimeout(() => {
          this.showDateMessage = false;
        }, 1500);
        this.dateMessage = this.helper.i18n('date', 'successfully_changed');
      }, err => {
        this.dateMessage = err.message;
        this.ifDateErr = true;
        setTimeout(() => {
          this.ifDateErr = false;
        }, 2500);
      });
  }
  hideAddAdminModal() {
    this.admin = null;
    this.submitted = false;
    this.addAdminForm.reset();
    this.addAdminModal.hide();
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
    this.deletedIndex = index;
    this.deleteAdminModal.show();
    this.admin = admin;
  }
  hideDeleteAdminModal() {
    this.disabled = false;
    this.admin = null;
    this.deleteAdminModal.hide();
  }
  showResendEmailModal(admin) {
    this.resendEmailModal.show();
    this.admin = admin;
  }
  hideResendEmailModal() {
    this.disabled = false;
    this.resendEmailModal.hide();
  }
  resendEmail() {
    this.disabled = true;
    this.spinner = true;
    this.httpRequests.resendEmailForAdmin(this.admin._id)
      .subscribe(data => {
        this.spinner = false;
        this.successAdd = true;
        setTimeout(() => {
          this.successAdd = false;
          this.hideResendEmailModal();
        }, 1500);
        this.errorMessage = this.helper.i18nVal('successfullySend');
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
}
