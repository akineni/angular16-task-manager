import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';
import { PreLoaderService } from './services/pre-loader.service';
import { Task } from './types/task.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  task: Task = { task: '' }; // Property is maintained here and passed to Child component <app-task-editor />
  
  constructor (
    public preLoader: PreLoaderService,
    public taskService: TaskService,
    public authService: AuthService) {}

  receiveUpdate(event: Task): void {
    this.task = event;
  }

  receiveDelete(event: number): void {
    if (this.task.id == event) this.clearTask();
  }

  clearTask(): void {
    this.task = { task: '' };
  }
  
  signOut(): void {
    this.clearTask();
    this.authService.signOut();
  }
}