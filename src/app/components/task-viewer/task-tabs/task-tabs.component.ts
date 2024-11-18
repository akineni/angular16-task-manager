import { Component, EventEmitter, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-tabs',
  templateUrl: './task-tabs.component.html',
  styleUrls: ['./task-tabs.component.css']
})
export class TaskTabsComponent {
  filterAttribute: string;
  filterValue: any = '0';

  @Output()
  filterEvent: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor (
    public taskService: TaskService
  ) {}

  filterBy(attribute: string = 'completed', value: any = ''): void {
    this.filterAttribute = attribute;
    this.filterValue = value;

    this.filterEvent.emit([this.filterAttribute, this.filterValue]);
  }
}