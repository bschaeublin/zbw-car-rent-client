import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {LoadingBarService} from '../services';
import {MatSnackBar} from '@angular/material';
import * as moment from 'moment';
import {Error} from 'tslint/lib/error';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private _loadingService: LoadingBarService,
              private _snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // start our loader here
    this._loadingService.start();

    return next.handle(req).do((event: HttpEvent<any>) => {
      // if the event is for http response
      if (event instanceof HttpResponse) {
        // stop our loader here
        this._loadingService.complete();
      }

    }, (err: Error) => {
      // if any error (not for just HttpResponse) we stop our loader bar
      this._loadingService.complete();
      this._snackBar.open('Oops, an error ocurred. (' + err.message + ')', null, { duration: 3000 });
    });
  }

}
