import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService, Util } from 'ami';
import { catchError } from 'rxjs/operators';
import { CmpService } from '../cmp/cmp.service';

@Injectable()
export class WebInterceptor implements HttpInterceptor {
    constructor(
        private cmp: CmpService,
        private authSrv: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        //this.cmp.unloading();

        let headers = request.headers; //.set('content-type', 'application/json');
        // // console.log(request)
        if (!Util.isEmpty(this.authSrv.JwtToken)) {
            headers = headers.set('Authorization', this.authSrv.JwtToken);
        }
        let url = request.url;
        if (request.url.indexOf('?')==-1) {
            url = request.url.endsWith('\/') ? request.url : request.url + '\/';
        }

        // saas
        const host = window.location.hostname.split('.');
        const hostname = host[0];
        const saas_ip = environment.api_ip.replace('{{saas}}', hostname);

        const req = request.clone({
            url: Util.joinpath(saas_ip, url),
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

