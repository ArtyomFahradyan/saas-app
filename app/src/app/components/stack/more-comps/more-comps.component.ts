import { Component, OnInit } from '@angular/core';
import {HelpersService} from '../../../services/helpers.service';
import {ActivatedRoute} from '@angular/router';
import {Contract} from '../../../models/contract';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-more-comps',
  templateUrl: './more-comps.component.html',
  styleUrls: ['./more-comps.component.scss']
})
export class MoreCompsComponent implements OnInit {
  contractId;
  contract: Contract = <Contract>{};
  customs = [];
  constructor(public helpers: HelpersService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) { }

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
      });
  }
}
