import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {HttpRequestsService} from '../../services/http-requests.service';
import {MeGlobal} from '../me';
import {NgForm} from '@angular/forms';
import {Team} from '../../models/team';
import {HelpersService} from '../../services/helpers.service';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {
  @ViewChild('addTeamModal') public addTeamModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  teamName = '';
  team = <Team>{};
  deletedTeamIndex = 0;
  ifErr = false;
  isAccountOwner = true;
  successAdd = false;
  teams: Team[] = [];
  errorMessage = '';
  showSuccess = false;
  showErr = false;
  disabled = false;
  constructor(private router: Router,
              public helper: HelpersService,
              public meGlobal: MeGlobal,
              private httpRequests: HttpRequestsService) {  }

  ngOnInit() {
    if (localStorage.getItem('isAccountOwner') === 'false') {
      this.isAccountOwner = false;
    }
    this.meGlobal.data.subscribe(data => {
      if (data.account._id) {
        this.getTeams(data.account._id);
      }
    });
  }
  hideAddTeamModal(form: NgForm) {
    form.resetForm();
    this.addTeamModal.hide();
  }
  showAddTeamModal() {
    this.addTeamModal.show();
  }
  addTeam(form: NgForm) {
    this.disabled = true;
    if (form.valid) {
      this.httpRequests.addTeam(form.value.teamName)
        .subscribe(data => {
          this.disabled = false;
          this.teams.push(data);
          this.successAdd = true;
          this.errorMessage = this.helper.i18n('team', 'successfully_add');
          setTimeout(() => {
            this.successAdd = false;
            this.hideAddTeamModal(form);
          }, 1500);
        }, err => {
          this.disabled = false;
          this.ifErr = true;
          setTimeout(() => {
            this.ifErr = false;
          }, 2500);
          this.errorMessage = err.message;
        });
    }
  }
  goToTeamPage(team) {
    this.router.navigate([`team/${team._id}`]);
  }
  getTeams(id) {
    this.httpRequests.getTeams(id)
      .subscribe(data => {
        this.teams = data;
      });
  }
  removeTeam() {
    this.disabled = true;
    this.httpRequests.deleteTeam(this.team._id)
      .subscribe(data => {
        this.showSuccess = true;
        this.errorMessage = this.helper.i18n('team', 'successfully_removed');
        this.disabled = false;
        setTimeout(() => {
          this.hideDeleteModal();
          this.showSuccess = false;
        }, 1500);
        this.teams.splice(this.deletedTeamIndex, 1);
      }, err => {
        this.errorMessage = err.message;
        this.disabled = false;
        this.showErr = true;
        setTimeout(() => {
          this.showErr = false;
        }, 2500);
      });
  }
  hideDeleteModal() {
    this.deleteModal.hide();
  }
  showDeleteModal(team, i) {
    this.deletedTeamIndex = i;
    this.team = team;
    this.deleteModal.show();
  }
}
