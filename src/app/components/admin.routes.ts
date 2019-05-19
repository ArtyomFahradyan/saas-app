import {Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AuthGuard} from '../services/auth-guard.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UploadComponent} from './upload/upload.component';
import {UsersServicesComponent} from './stack/users-services.component';
import {SettingsComponent} from './settings/settings.component';
import {MyTeamComponent} from './my-team/my-team.component';
import {TeamComponent} from './my-team/team/team.component';
import {ContractComponent} from './stack/contract/contract.component';
import {MoreCompsComponent} from './stack/more-comps/more-comps.component';
import {IsOwnerGuardService} from '../services/is-owner-guard.service';
import {NotFoundComponent} from './not-found';

export const routes: Routes = [
  { path: '', component: AdminComponent, canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
      { path: 'add-new-service', component: UploadComponent },
      { path: 'stack', component: UsersServicesComponent },
      { path: 'settings', component: SettingsComponent, canActivate: [IsOwnerGuardService] },
      { path: 'my-team', component: MyTeamComponent },
      { path: 'team/:teamId', component: TeamComponent },
      { path: 'stack/:contractId', component: ContractComponent },
      { path: 'more-comps/:contractId', component: MoreCompsComponent }
    ]
  },
  { path: '**', component: NotFoundComponent },
];
