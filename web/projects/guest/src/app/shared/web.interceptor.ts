import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService, Util } from 'ami';
import { catchError } from 'rxjs/operators';

@Injectable()
export class WebInterceptor implements HttpInterceptor {
    constructor(
        private authSrv: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let headers = request.headers;//.set('content-type', 'application/json');
        // // console.log(request)
        if (!Util.isEmpty(this.authSrv.JwtToken)) {
            headers = headers.set('Authorization', this.authSrv.JwtToken);
        }

        const req = request.clone({
            url: Util.joinpath(environment.api_ip, request.url),
            headers: headers
        });

        return next.handle(req)
            .pipe(
                catchError((error: any) => {
                    // console.log(error)

                    if (error instanceof HttpErrorResponse && error.status === 0) {
                        this.authSrv.connectError(error);
                    }
                    return throwError(error);
                })
            )
    }
}

