import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {
  @ViewChild('addTeamModal') public addTeamModal: ModalDirective;

  teams = [
    {
      name: 'Marketing',
      _id: 'sdd54sfd745dsf78'
    },
    {
      name: 'HR',
      _id: 'sdd54sfd745dsf78'
    },
    {
      name: 'Sales',
      _id: 'sdd54sfd745dsf78'
    },
  ];
  constructor(private router: Router) { }

  ngOnInit() {}
  loadMoreTeams() {

  }
  hideAddTeamModal() {
    this.addTeamModal.hide();
  }
  showAddTeamModal() {
    this.addTeamModal.show();
  }
  addTeam() {

  }
  goToTeamPage(team) {
    console.log(team);
    this.router.navigate([`team/${team._id}`]);
  }
}
