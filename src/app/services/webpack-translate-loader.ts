import { TranslateLoader } from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {from} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebpackTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return from(System.import(`../../assets/i18n/${lang}.json`));
  }
}
