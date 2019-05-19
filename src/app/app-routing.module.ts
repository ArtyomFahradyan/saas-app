import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {AuthGuardForHome} from './services/auth-guard.service';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ResetPasswordConfirmComponent} from './components/reset-password-confirm/reset-password-confirm.component';
import {InviteConfirmComponent} from './components/invite-confirm/invite-confirm.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardForHome] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuardForHome] },
  { path: 'verify-email/confirm', redirectTo: 'login', pathMatch: 'full'},
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuardForHome] },
  { path: 'reset-password/confirm', component: ResetPasswordConfirmComponent, canActivate: [AuthGuardForHome] },
  { path: 'invite/confirm', component: InviteConfirmComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
