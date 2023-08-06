import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment as env } from 'src/environments/environment';
import { AccessToken } from '../types/access-token.type';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401 && error.error.message == 'Unauthenticated.') {
          return this.authService.refreshToken().pipe(
            switchMap((token: AccessToken) => {
              localStorage.setItem(env.local_storage_access_token_key, token.token);

              const modifiedRequest = request.clone({
                setHeaders: {
                  'Authorization': 'Bearer ' + token.token
                }
              });
              return next.handle(modifiedRequest);
            }),
            catchError((refreshError: HttpErrorResponse) => {
              this.authService.signOut();
              return throwError(refreshError);
            })
          );
        }else {
          return throwError(error);
        }
      })
    );
  }
}