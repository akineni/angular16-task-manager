import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  private authStateSubscription: Subscription;

  constructor (
    private authService: AuthService,
    private socialAuthService: SocialAuthService ) {}

  ngOnInit(): void {
    this.authStateSubscription = this.socialAuthService.authState.subscribe((user: SocialUser) => {
      this.authService.authenticate(user.idToken);
      this.authService.socialUser = user;
    });
  }

  LogInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  ngOnDestroy(): void{
    // Unsubscribe to avoid having multiple observers and executing multiple times
    // https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f?gi=8b1d3ff4c5a0
    this.authStateSubscription.unsubscribe();
  }

}
