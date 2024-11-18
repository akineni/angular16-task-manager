import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from 'src/app/types/task.type';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.css']
})
export class TaskViewerComponent implements OnInit{
  filterAttribute: string = 'completed';
  filterValue: any = '0';

  searchFilter: string = '';

  @Output()
  updateEvent: EventEmitter<Task> = new EventEmitter<Task>();

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

  delete(taskId: number): void {
    this.taskService.deleteTask(taskId);
  }

  update(task: Task): void {
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

  filterBy(attribute: string = 'completed', value: any = ''): void {
    this.filterAttribute = attribute;
    this.filterValue = value;
  }

  // getMissedTasks(): any {
  //   const missedTasks = this.taskService.tasks.filter(task => this.isPast(task.deadline) && !task.completed);
  //   this.filterValue = missedTasks.map(task => task.id);
  //   return this.filterValue;
  // }

  isPast(date: any): boolean {
    return new Date() > new Date(date);
  }

  ngOnDestroy(): void{
    // Unsubscribe to avoid having multiple observers and executing multiple times
    // https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f?gi=8b1d3ff4c5a0
    this.authEventSubscription.unsubscribe();
  }
}
