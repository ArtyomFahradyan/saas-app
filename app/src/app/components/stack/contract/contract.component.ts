import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../services/user.service';
import {HelpersService} from '../../../services/helpers.service';
import {NgForm} from '@angular/forms';
import {Contract} from '../../../models/contract';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {
  @ViewChild('noteForm') noteForm: NgForm;
  contractId;
  contract: Contract = <Contract>{};
  customs = [];
  notifyAdmin = false;
  note = '';
  noteAreReq = false;
  reqFields = false;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              public helpers: HelpersService,
              private userService: UserService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe( () => {
      this.contractId = this.activatedRoute.snapshot.params['contractId'];
      this.getContracts();
    });
  }
  getContracts() {
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
        const custmObj = {};
        this.customs.forEach((item, i) => {
          custmObj[item[0]] = item[1];
        });
        this.send(custmObj);
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
        this.router.navigate(['/users-services']);
        this.customs.length = 0;
        this.noteForm.resetForm();
        console.log(data);
      });
  }
  addCustom() {
    this.customs.push(['', '']);
  }
  deleteCustomRow(i) {
    this.customs.splice(i, 1);
    this.noteAreReq = !!this.customs.length;
  }
}
