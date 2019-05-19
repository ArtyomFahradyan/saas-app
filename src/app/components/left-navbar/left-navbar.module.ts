import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LeftNavbarComponent} from './left-navbar.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {WebpackTranslateLoader} from '../../services/webpack-translate-loader';
import {AppRoutingModule} from '../../app-routing.module';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    LeftNavbarComponent
  ],
  imports: [
    ModalModule.forRoot(),
    CommonModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    })
  ],
  exports: [LeftNavbarComponent]
})
export class LeftNavbarModule { }
