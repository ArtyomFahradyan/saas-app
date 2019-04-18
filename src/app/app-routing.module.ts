import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AuthGuard, AuthGuardForHome} from './services/auth-guard.service';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ResetPasswordConfirmComponent} from './components/reset-password-confirm/reset-password-confirm.component';
import {UploadComponent} from './components/upload/upload.component';
import {UsersServicesComponent} from './components/stack/users-services.component';
import {ContractComponent} from './components/stack/contract/contract.component';
import {SettingsComponent} from './components/settings/settings.component';
import {MyTeamComponent} from './components/my-team/my-team.component';
import {TeamComponent} from './components/my-team/team/team.component';
import {InviteConfirmComponent} from './components/invite-confirm/invite-confirm.component';
import {MoreCompsComponent} from './components/stack/more-comps/more-comps.component';

const routes: Routes = [
  // { path: '**', component: NoContentComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardForHome] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuardForHome] },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'verify-email/confirm', redirectTo: 'login', pathMatch: 'full'},
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuardForHome] },
  { path: 'reset-password/confirm', component: ResetPasswordConfirmComponent, canActivate: [AuthGuardForHome] },
  { path: 'create-new-service', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'stack', component: UsersServicesComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'my-team', component: MyTeamComponent, canActivate: [AuthGuard] },
  { path: 'team/:teamId', component: TeamComponent, canActivate: [AuthGuard] },
  { path: 'invite/confirm', component: InviteConfirmComponent},
  { path: 'stack/:contractId', component: ContractComponent, canActivate: [AuthGuard] },
  { path: 'more-comps/:contractId', component: MoreCompsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
