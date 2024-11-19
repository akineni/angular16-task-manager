import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/types/task.type';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.css']
})
export class TaskViewerComponent implements OnInit{
  /*
    * setting filterAttribute and filterValue filters the task list on startup.
    * 'completed' and '0'; hence show uncompleted (Active) tasks.
  */
  filterAttribute: string = 'completed';
  filterValue: any = '0';
  searchFilter: string = '';

  @Output() updateEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();

  private authEventSubscription: Subscription;
  
  constructor (
    public taskService: TaskService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.authEventSubscription = this.authService.authEvent.subscribe(() => {
      this.taskService.getTasks();
    });
    if(this.authService.isLoggedIn()){
      this.authService.authEvent.emit();      
    }
  }

  propagateUpward(event: number | Task): void {
    // Re-emit the grandchild's event
    if (typeof event == 'number') // Its a delete event
      this.deleteEvent.emit(event);
    else
      this.updateEvent.emit(event);
  }

  receiveUpdate(event: string[]): void {
    [this.filterAttribute, this.filterValue] = event;
  }

  // getMissedTasks(): any {
  //   const missedTasks = this.taskService.tasks.filter(task => this.isPast(task.deadline) && !task.completed);
  //   this.filterValue = missedTasks.map(task => task.id);
  //   return this.filterValue;
  // }

  ngOnDestroy(): void{
    // Unsubscribe to avoid having multiple observers and executing multiple times
    // https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f?gi=8b1d3ff4c5a0
    this.authEventSubscription.unsubscribe();
  }
}
