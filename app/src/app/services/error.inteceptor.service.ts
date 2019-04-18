import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {Injectable} from '@angular/core';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                  let message = '';
                    if (error.error.message) {
                        // client-side error
                        message = `${error.error.message}`;
                    } else {
                        // server-side error
                        message = `Server has experienced an error, please try again later.`;
                    }
                    console.log(error);
                    return throwError(message);
                })
            );
    }
}
