import {AdminComponent} from './admin.component';
import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UploadComponent} from './upload/upload.component';
import {UsersServicesComponent} from './stack/users-services.component';
import {SettingsComponent} from './settings/settings.component';
import {MyTeamComponent} from './my-team/my-team.component';
import {TeamComponent} from './my-team/team/team.component';
import {ContractComponent} from './stack/contract/contract.component';
import {MoreCompsComponent} from './stack/more-comps/more-comps.component';
import {ModalModule} from 'ngx-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from '../services/auth-guard.service';
import {AuthService} from '../services/auth.service';
import {AuthInterceptor} from '../services/auth.interceptor';
import {UserService} from '../services/user.service';
import {UploadService} from '../services/upload.service';
import {PreloadAllModules, RouterModule} from '@angular/router';
import {routes} from './admin.routes';
import {LeftNavbarComponent} from './left-navbar/left-navbar.component';
import {TopNavComponent} from './top-nav/top-nav.component';
import {HttpRequestsService} from '../services/http-requests.service';
import {MeGlobal} from './me';
import {TooltipDirective} from '../directives/tooltip.directive';
import {TooltipModule} from 'ng2-tooltip-directive';
import {IsOwnerGuardService} from '../services/is-owner-guard.service';
import {NotFoundComponent} from './not-found';
import {ErrorMessage} from '../services/errorInterceptorMessage';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {WebpackTranslateLoader} from '../services/webpack-translate-loader';
import {TopNavModule} from './top-nav/top-nav.module';
import {LeftNavbarModule} from './left-navbar/left-navbar.module';
import {DashboardModule} from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AdminComponent,
    UploadComponent,
    UsersServicesComponent,
    SettingsComponent,
    MyTeamComponent,
    TeamComponent,
    ContractComponent,
    MoreCompsComponent,
    TooltipDirective,
    NotFoundComponent
  ],
  imports: [
    TopNavModule,
    LeftNavbarModule,
    DashboardModule,
    TooltipModule,
    ModalModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    }),
    MatTableModule,
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
    ErrorMessage,
    MeGlobal,
    AuthGuard,
    IsOwnerGuardService,
    AuthService,
    AuthInterceptor,
    UserService,
    HttpRequestsService,
    UploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
