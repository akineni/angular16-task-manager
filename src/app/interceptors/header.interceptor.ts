import { Injectable } from '@angular/core';
import { environment as env} from 'src/environments/environment';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  private protectedRoutes: string[] = ['task', 'tasks', 'refresh'];

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var urlPathArray = new URL(request.url).pathname.split('/');
    var intersectionArray = this.protectedRoutes.filter(value => urlPathArray.includes(value));
    
    if(intersectionArray.length != 0){
      request = request.clone({
        headers: request.headers.set(
          'Authorization', 'Bearer ' + localStorage.getItem(env.local_storage_access_token_key))
      });
    }
        
    return next.handle(request);
  }
}
