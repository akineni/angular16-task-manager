import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { AuthService } from './services/auth.service';
import { PreLoaderService } from './services/pre-loader.service';
import { Task } from './types/task.type';
import { environment as env} from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  task: Task = { task: '' }; // Property is maintained here and passed to Child component <app-task-editor />
  
  constructor (
    public preLoader: PreLoaderService,
    public taskService: TaskService,
    public authService: AuthService,
    private socialAuthService: SocialAuthService ) {}

  ngOnInit(): void {
    this.authService.authEvent.subscribe(() => {
      /*if(!this.taskService.tasks) */this.taskService.getTasks();
    });
        
    if(this.authService.isLoggedIn()) this.authService.authEvent.emit();
  }

  receiveUpdate(event: Task): void {
    this.task = event;
  }

  clearTask(): void {
    this.task = { task: '' };
  }
  
  signOut(): void {
    localStorage.removeItem(env.local_storage_access_token_key);
    if(this.authService.socialUser) this.socialAuthService.signOut();
  }

}
