import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PreLoaderService } from 'src/app/services/pre-loader.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/task.type';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent {
  /*
    If we pass objects in @Input() decorator then it would be passed as reference,
    and if we pass primitive types, then it would be passed as value.
  */
  // https://stackoverflow.com/questions/40260158/angular2-pass-by-reference-to-interact-between-components
  // https://www.infragistics.com/community/blogs/b/infragistics/posts/angular-components-pass-by-reference-or-pass-by-value
  
  @Input() id?: number;
  @Input() taskTask: string;
  @Input() completed?: number | boolean;
  @Input() deadline?: string;

  @Output() clearTaskEvent: EventEmitter<void> = new EventEmitter<void>();
  // @ViewChild('taskInput') taskInput: ElementRef;
  
  constructor (
    public preLoader: PreLoaderService,
    public taskService: TaskService ) {}

  /*ngOnChanges(change: any): void {
    // Tracking @input changes with ngOnChanges()
    // https://stackoverflow.com/questions/38571812/how-to-detect-when-an-input-value-changes-in-angular
    
    // Make input label float when it receives a new value
    if(this.taskInput){ // Avoid 'undefined' console error on page load       
      if(change.taskTask.currentValue)
        this.taskInput.nativeElement.classList.add('active');
      else
        this.taskInput.nativeElement.classList.remove('active');
    }
  }*/

  add(): void {
    if(this.taskTask && this.deadline){      
      if(new Date(this.deadline) > new Date()){
        if(this.id)
          this.update();
        else{
          this.preLoader.enable('Adding task');
          this.taskService.createTask(this.createTask()).subscribe((t: Task) => {
            this.taskService.tasks.push(t);
            this.clearTask();
            this.preLoader.disable();
          },
          () => {  // Error
            this.preLoader.disable();
          });
        }
      }else
        alert('Deadline cannot be in the past');
    }else
      alert('Task and Deadline must not be empty.');
  }

  private update(): void {
    const taskUpdate: Task = this.createTask(this.id, this.completed);
    this.preLoader.enable('Updating task');
    this.taskService.updateTask(taskUpdate).subscribe((result: number) => {
      if(result == 1) {
        const index = this.taskService.tasks.findIndex(task => task.id == this.id);
        this.taskService.tasks[index] = taskUpdate;
        this.clearTask(true);
      }
      this.preLoader.disable();
    },
    () => { // Error
      this.preLoader.disable();
    });
  }

  private createTask(id: number | undefined = undefined, completed: number | boolean | undefined = undefined): Task {
    const task: Task = {
      'task': this.taskTask,
      'deadline': this.deadline
    }
    if(id) task.id = id;
    if(completed !== undefined) task.completed = completed; //!== undefined: completed when false is 0
    return task;
  }

  clearTask(update: boolean = false): void {
    if(update)
      this.clearTaskEvent.emit(); // For update()
    else {
      // Clear local primitives for add()
      this.taskTask = '';
      delete this.id;
      delete this.completed;
      delete this.deadline;
      // Return input's floating label to its default position
      /*this.taskInput.nativeElement.classList.remove('active');*/
    }    
  }

  clear(): void {
    if (this.id) { // Update
      this.clearTask(true);
    } else
      this.clearTask();
  }
 }
