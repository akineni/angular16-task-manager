import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { SocialAuthService, SocialUser, FacebookLoginProvider } from "@abacritt/angularx-social-login";
import { AuthService } from './services/auth.service';
import { PreLoaderService } from './services/pre-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title: string = 'TaskManager';
  
  constructor (
    public preLoader: PreLoaderService,
    public taskService: TaskService,
    public authService: AuthService,
    private socialAuthService: SocialAuthService ) {}

  ngOnInit(): void {
    this.authService.authEvent.subscribe(() => {
      this.taskService.getTasks();
    });

    if(this.authService.isLoggedIn())
      this.authService.authEvent.emit()
    else {
      this.socialAuthService.authState.subscribe((user: SocialUser) => {
        this.authService.authenticate(user.idToken);
      });
    }
  }

  LogInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

}
