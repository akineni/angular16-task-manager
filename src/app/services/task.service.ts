import { Injectable } from '@angular/core';
import { Task } from '../types/task.type';
import { HttpClient } from '@angular/common/http';
import { environment as env} from 'src/environments/environment.development';
import { PreLoaderService } from './pre-loader.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Task[];

  constructor(
    private httpClient: HttpClient,
    private preLoader: PreLoaderService
    ) {}

  getTasks(): void {
    this.preLoader.enable('Getting your tasks');

    this.httpClient.get<Task[]>(env.backend_root + 'tasks')
    .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.preLoader.disable();
      },
      (error: any) => {
        this.preLoader.disable();
      });
  }

  createTask(task: Task): Observable<Task> {
     return this.httpClient.post<Task>(env.backend_root + 'task', task);
  }

  updateTask(task: Task): void {
    //getTasks
  }

  deleteTask(taskId: number): void {
    this.preLoader.enable('Deleting task');

    this.httpClient.delete(env.backend_root + 'task/' + taskId)
    .subscribe(() => {
        this.tasks.splice(this.tasks.findIndex((task) => task.id == taskId), 1);
        this.preLoader.disable();
      },
      (error: any) => {
        this.preLoader.disable();
      });
  }
  
}
