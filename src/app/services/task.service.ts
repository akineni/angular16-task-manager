import { Injectable } from '@angular/core';
import { Task } from '../types/task.type';
import { HttpClient } from '@angular/common/http';
import { environment as env} from 'src/environments/environment';
import { PreLoaderService } from './pre-loader.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[];
  updating: Task = {'task': ''};

  constructor(
    private httpClient: HttpClient,
    private preLoader: PreLoaderService
    ) {}

  getTasks(): void {
    this.preLoader.enable('Getting your tasks');

    this.httpClient.get<Task[]>(env.backend_root + 'tasks').subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.preLoader.disable();
    },
    () => { // error
      this.preLoader.disable();
    });
  }

  createTask(task: Task): Observable<Task> {
     return this.httpClient.post<Task>(env.backend_root + 'task', task);
  }

  updateTask(task: Task): Observable<number> {
    return this.httpClient.put<number>(
      env.backend_root + 'task/' + task.id,
      { 'task': task.task, 'deadline': task.deadline }
    );
  }

  updateCompleted(taskId: number, completed: boolean): Observable<number> {    
    return this.httpClient.put<number>(env.backend_root + 'task/completed/' + taskId, {completed});
  }

  deleteTask(taskId: number): void {
    /* 
      preLoader here is an approach to slow down the user
      as deletion should be with caution.

      See also comments in task-viewer.component.ts > updateCompleted(...)
    */
    this.preLoader.enable('Deleting task');

    this.httpClient.delete(env.backend_root + 'task/' + taskId)
    .subscribe(() => {
        this.tasks.splice(this.tasks.findIndex(task => task.id == taskId), 1);
        this.preLoader.disable();
      },
      () => { // error
        this.preLoader.disable();
      });
  }

  clearUpdating() { this.updating.updating = false; }

  setUpdating(task: Task) {
    task.updating = true;
    this.updating = task;
  }
}