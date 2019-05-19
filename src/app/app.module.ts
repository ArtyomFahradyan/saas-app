import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {SignupComponent} from './components/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuardForHome} from './services/auth-guard.service';
import {UserService} from './services/user.service';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {ResetPasswordConfirmComponent} from './components/reset-password-confirm/reset-password-confirm.component';
import {UploadService} from './services/upload.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalModule} from 'ngx-bootstrap';
import {HttpErrorInterceptor} from './services/error.inteceptor.service';
import {InviteConfirmComponent} from './components/invite-confirm/invite-confirm.component';
import {AuthService} from './services/auth.service';
import {AdminModule} from './components/admin.module';
import {DetectRouterEventsService} from './services/detect-router-events.service';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {ErrorMessage} from './services/errorInterceptorMessage';
import {WebpackTranslateLoader} from './services/webpack-translate-loader';
import {TopNavModule} from './components/top-nav/top-nav.module';
import {LeftNavbarModule} from './components/left-navbar/left-navbar.module';
import {DashboardModule} from './components/dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    ResetPasswordConfirmComponent,
    InviteConfirmComponent,
  ],
  imports: [
    TopNavModule,
    LeftNavbarModule,
    DashboardModule,
    ModalModule.forRoot(),
    AdminModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    })
  ],
  providers: [
    WebpackTranslateLoader,
    AuthGuardForHome,
    ErrorMessage,
    DetectRouterEventsService,
    AuthService,
    UserService,
    UploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
