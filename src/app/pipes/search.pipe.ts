import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../types/task.type';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: Task[], ...args: string[]): Task[] {
    return value ? value.filter(t => t.task.toLowerCase().includes(args[0].toLowerCase())) : value;
  }

}
