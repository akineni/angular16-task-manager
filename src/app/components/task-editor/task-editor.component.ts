import { Component } from '@angular/core';
import { PreLoaderService } from 'src/app/services/pre-loader.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/task.type';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent {
  task: Task = { task: '' };

  constructor (
    public preLoader: PreLoaderService,
    public taskService: TaskService ) {}

  add(): void {
    if(this.task.task && this.task.deadline){
      if(new Date(this.task.deadline) > new Date()){
        this.preLoader.enable('Adding task');
        this.taskService.createTask(this.task).subscribe((t: Task) => {
          this.taskService.tasks.push(t);
          this.task = { task: '' };
          this.preLoader.disable();
        },
        (error: any) => {      
          this.preLoader.disable();
        });
      }else
        alert('Deadline cannot be in the past');
    }else
      alert('Task and Deadline must not be empty.');
  }
}
