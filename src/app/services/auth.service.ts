import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env} from 'src/environments/environment';
import { PreLoaderService } from './pre-loader.service';
import { AccessToken } from '../types/access-token.type';
import { Observable } from 'rxjs';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  socialUser?: SocialUser;
  authEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private httpClient: HttpClient,
    private preLoader: PreLoaderService,
    private socialAuthService: SocialAuthService,
    private taskService: TaskService
    ) { }

  authenticate(idToken: string): void {
    this.preLoader.enable('Signing in');

    this.httpClient.post<AccessToken>(
      env.backend_root + 'auth', { idToken }
    ).subscribe((data: AccessToken) => {
        if(data.token) localStorage.setItem(env.local_storage_access_token_key, data.token)
        this.preLoader.disable();
      },
      () => { // error
        this.preLoader.disable();
        setTimeout(() => alert('An error occured, please try again'), 500);

        /*
          SSL certificate error: (This worked for me)
          GuzzleHttp \ Exception \ RequestException cURL error 60: SSL certificate problem: unable to get local issuer certificate (see http://curl.haxx.se/libcurl/c/libcurl-errors.html)
          https://laracasts.com/discuss/channels/laravel/guzzlehttp-exception-requestexception-curl-error-60-ssl-certificate-problem-unable-to-get-local-issuer-certificate-see-httpcurlhaxxselibcurlclibcurl-errorshtml
          https://stackoverflow.com/questions/35638497/curl-error-60-ssl-certificate-prblm-unable-to-get-local-issuer-certificate
        */
      });
  }

  refreshToken(): Observable<AccessToken> {
    return this.httpClient.get<AccessToken>(env.backend_root + 'auth/refresh');    
  }

  isLoggedIn(): boolean { return localStorage.getItem(env.local_storage_access_token_key) !== null; }

  signOut(): void {
    this.taskService.tasks = [];
    localStorage.removeItem(env.local_storage_access_token_key);
    if(this.socialUser){
      this.socialAuthService.signOut();
      delete this.socialUser;      
    }
  }
}
