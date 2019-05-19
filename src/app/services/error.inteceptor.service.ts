import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ErrorMessage} from './errorInterceptorMessage';
import {HelpersService} from './helpers.service';
import {TranslateService} from '@ngx-translate/core';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public errorMessage: ErrorMessage, private helper: HelpersService, private translate: TranslateService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(catchError((err: HttpErrorResponse) => {
                    let message = '',
                        errors;
                    if (err.error && err.error.message) {
                      message = err.error.message;
                      if (err.error.errors && Object.keys(err.error.errors).length) {
                        errors = Object.keys(err.error.errors);
                        if (err.error.errors.response) {
                          errors = [this.helper.i18nVal(message)];
                        } else {
                          errors = errors.map(item => {
                            return this.helper.i18n(item, message + '_func');
                          });
                        }
                        this.errorMessage.messages = errors;
                        const div = document.getElementById('popup');
                        if (div) {
                          div.classList.add('show-elem');
                          setTimeout(() => {
                            div.classList.remove('show-elem');
                          }, 5000);
                        }
                      } else {
                        this.translate.get(message).subscribe(str => {
                          return throwError({message});
                        });
                      }
                      this.translate.get(message).subscribe(str => {
                        message = str;
                      });
                      return throwError({message});
                    } else {
                        // server-side error
                        this.translate.get('serverExperiencedError').subscribe((res: string) => {
                          message = res;
                        });
                        this.errorMessage.message = message;
                        const div = document.getElementById('errorMessages');
                        if (div) {
                          div.classList.add('bounceInDown');
                          setTimeout(() => {
                            div.classList.remove('bounceInDown');
                          }, 5000);
                        }
                    }
                    console.log(err);
              })
            );
    }
}
