import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {HelpersService} from '../../../services/helpers.service';
import {NgForm} from '@angular/forms';
import {Contract} from '../../../models/contract';
import {ModalDirective} from 'ngx-bootstrap';
import {HttpRequestsService} from '../../../services/http-requests.service';
import {Attachment} from '../../../models/attachment';
import {MeGlobal} from '../../me';
// import * as FileSaver from 'file-saver';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  @ViewChild('noteForm') noteForm: NgForm;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  attachments: Attachment[] = [];
  contractId;
  messageType: 'success' | 'error' = 'success';
  message = '';
  showMessage = false;
  contract: Contract = <Contract>{};
  customs = [];
  notifyAdmin = false;
  note = '';
  noteAreReq = false;
  reqFields = false;
  disabled = false;
  spinner = false;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meGlobal: MeGlobal,
              public helpers: HelpersService,
              private httpRequests: HttpRequestsService,
              private userService: UserService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( () => {
      this.contractId = this.activatedRoute.snapshot.params['contractId'];
      this.getContract();
    });
    this.meGlobal.data.subscribe(data => {
      if (data.account.reminder) {
        this.attachments = data.account.attachments;
      }
    });
  }
  onVoted(agreed: boolean) {
    this.contract.attachment = agreed['_id'];
  }
  goBack() {
    this.router.navigate(['stack']);
  }
  getContract() {
    this.userService.getContract(this.contractId)
      .subscribe(data => {
        this.contract = data;
        if (data.customField) {
          this.customs = Object.entries(data.customField);
        }
        this.note = data.notes;
      });
  }
  onSubmit() {
    this.noteAreReq = !!this.note;
    if (this.note && this.customs.length) {
      this.reqFields = false;

      this.customs.forEach((item) => {
        if (!item[0] || !item[1]) {
          return this.reqFields = true;
        }
      });
      if (!this.reqFields) {
        const customObj = {};
        this.customs.forEach((item) => {
          customObj[item[0]] = item[1];
        });
        this.send(customObj);
      }
    } else {
      if (this.note) {
        this.send();
      }
    }
  }

  send(customObj = null) {
    this.userService.sendNotes(this.contractId , this.note, customObj, this.notifyAdmin)
      .subscribe(data => {
        this.router.navigate(['/stack']);
        this.customs.length = 0;
        this.noteForm.resetForm();
      });
  }
  addCustom() {
    this.customs.push(['', '']);
  }
  deleteCustomRow(i) {
    this.customs.splice(i, 1);
    if (!this.customs.length) {
      this.reqFields = false;
    }
    this.noteAreReq = !!this.customs.length;
  }
  deleteContract() {
    this.disabled = true;
    this.spinner = true;
    this.httpRequests.deleteContract(this.contractId)
      .subscribe(data => {
        this.spinner = false;
        this.messageType = 'success';
        this.message = this.helpers.i18n('service', 'successfully_removed');
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.router.navigate(['/stack']);
        }, 1500);
      }, err => {
        this.spinner = false;
        this.disabled = false;
        this.messageType = 'error';
        this.message = err.message;
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 2500);
      });
  }
  hideEditModal() {
    this.showMessage = false;
    this.deleteModal.hide();
  }
  showDeleteModal() {
    this.deleteModal.show();
  }
  editNote(notesArea) {
    notesArea.focus();
  }
  deleteNote(notesArea) {
    notesArea.focus();
    this.note = '';
  }
  download(id) {
    this.httpRequests.download(id)
      .subscribe(data => {
        window.open(data.location, '_blank');
        // (next: ArrayBuffer) => {
        //   const file: Blob = new Blob([next], {type: 'application/pdf'});
        //   FileSaver.saveAs(file, 'contract.pdf');
        // }
      });
  }
}
