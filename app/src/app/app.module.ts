import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard, AuthGuardForHome} from './services/auth-guard.service';
import {AuthService} from './services/auth.service';
import {AuthInterceptor} from './services/auth.interceptor';
import {UserService} from './services/user.service';
import {AlertService} from './services/alert.service';
import { AlertComponent } from './components/alert/alert.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './components/reset-password-confirm/reset-password-confirm.component';
import {NoContentComponent} from './components/no-content/no-content.component';
import {DetectRouterEventsService} from './services/detect-router-events.service';
import { UploadComponent } from './components/upload/upload.component';
import {UploadService} from './services/upload.service';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { UsersServicesComponent } from './components/stack/users-services.component';
import {MatTableModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ContractComponent } from './components/stack/contract/contract.component';
import {ModalModule} from 'ngx-bootstrap';
import {HttpErrorInterceptor} from './services/error.inteceptor.service';
import {SettingsComponent} from './components/settings/settings.component';
import { MyTeamComponent } from './components/my-team/my-team.component';
import { TeamComponent } from './components/my-team/team/team.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { InviteConfirmComponent } from './components/invite-confirm/invite-confirm.component';
import { MoreCompsComponent } from './components/stack/more-comps/more-comps.component';
import { LeftNavbarComponent } from './components/left-navbar/left-navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AlertComponent,
    SettingsComponent,
    DashboardComponent,
    ResetPasswordComponent,
    ResetPasswordConfirmComponent,
    NoContentComponent,
    UploadComponent,
    TopNavbarComponent,
    UsersServicesComponent,
    ContractComponent,
    MyTeamComponent,
    TeamComponent,
    TopNavComponent,
    InviteConfirmComponent,
    MoreCompsComponent,
    LeftNavbarComponent
  ],
  imports: [
    ModalModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    AuthGuardForHome,
    AuthService,
    AuthInterceptor,
    UserService,
    AlertService,
    DetectRouterEventsService,
    UploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
