import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from '../../app-routing.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {WebpackTranslateLoader} from '../../services/webpack-translate-loader';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard.routing.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    // AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    })
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
