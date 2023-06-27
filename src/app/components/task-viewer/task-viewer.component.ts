import { Component } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.css']
})
export class TaskViewerComponent {
  filterAttribute: string = 'completed';
  filterValue: any = '';
  
  constructor (
    public taskService: TaskService) {}

  delete(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  filterBy(attribute: string = 'completed', value: any = ''): void {
    this.filterAttribute = attribute;
    this.filterValue = value;
  }
}
