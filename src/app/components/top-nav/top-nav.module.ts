import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TopNavComponent} from './top-nav.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {WebpackTranslateLoader} from '../../services/webpack-translate-loader';
import {AppRoutingModule} from '../../app-routing.module';

@NgModule({
  declarations: [
    TopNavComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader
      }
    })
  ],
  exports: [TopNavComponent]
})
export class TopNavModule { }
