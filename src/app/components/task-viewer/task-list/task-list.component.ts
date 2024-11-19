import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/task.type';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {

  @Input() filterAttribute: string;
  @Input() filterValue: any;
  @Input() searchFilter: string;

  @Output() updateEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();

  editing: boolean = false;

  constructor (
    public taskService: TaskService
  ) {}

  delete(taskId: number): void {
    this.taskService.deleteTask(taskId);
    this.deleteEvent.emit(taskId);
  }

  update(task: Task): void {
    this.taskService.clearUpdating();
    this.taskService.setUpdating(task);
    this.updateEvent.emit(task);
  }

  updateCompleted(taskId: number, event: any): void {
    /*
      Using preLoader here is a bad user-experience as it prevents
      seamless checking of multiple tasks, making a user wait per click.

      In an interface with list of actions (e.g checkbox), a user should be able
      to click many checkboxes seamlessly (without interruption or obstruction)
      while the corresponding actions happen simultaneously.

      But a caveat here is that because the DOM updates (angular change detection) in real time,
      during clicking user will click an unintended action.

      Same for delete action too.
      A way to solve this is to suspend change detection (if possible), listen for seamless
      checkbox changes and delay before firing change detection. #UNIMPLEMENTED 
    */
    this.taskService.updateCompleted(taskId, event.target.checked).pipe(
      catchError(() => of(0))
    ).subscribe(
      (result: number) => {        
        const index = this.taskService.tasks.findIndex(task => task.id == taskId);
        if(result == 1)
          this.taskService.tasks[index].completed = Number(event.target.checked);
        else {
          event.target.checked = !event.target.checked;
          // Give a toast alert: non-blocking
        }         
      });
  }

  isPast(date: any): boolean {
    return new Date() > new Date(date);
  }
}