import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env} from 'src/environments/environment';
import { PreLoaderService } from './pre-loader.service';
import { AccessToken } from '../types/access-token.type';
import { Observable } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  socialUser: SocialUser;
  authEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private httpClient: HttpClient,
    private preLoader: PreLoaderService    
    ) { }

  authenticate(idToken: string): void {

    this.preLoader.enable('Signing in');

    this.httpClient.post<any>(
      env.backend_root + 'auth', { idToken }
    ).subscribe((data: any) => {
        if(data.token) localStorage.setItem(env.local_storage_access_token_key, data.token)
        this.preLoader.disable();
        this.authEvent.emit();        
      });

  }

  refreshToken(): Observable<AccessToken> {
    return this.httpClient.get<AccessToken>(env.backend_root + 'auth/refresh');    
  }

  isLoggedIn(): boolean { return localStorage.getItem(env.local_storage_access_token_key) !== null; }
}
