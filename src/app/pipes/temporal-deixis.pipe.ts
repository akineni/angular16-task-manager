import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temporalDeixis'
})
export class TemporalDeixisPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const date: Date = new Date(value);
    const diffDays: number = date.getDate() - new Date().getDate();

    var temporalDeixis: string;

    if (diffDays == 0)
      temporalDeixis = 'Today';
    else if (diffDays == -1)
      temporalDeixis = 'Yesterday';
    else if (diffDays == 1)
      temporalDeixis = 'Tomorrow';    
    else if (diffDays > 1 && diffDays <= 7) { // Within a/the week
      temporalDeixis = date.getDay().toString();
    } else if (diffDays < -1 && diffDays >= -7) { // Within the past week
        temporalDeixis = 'Last ' + date.getDay().toString();
    } else if (diffDays > 7 && diffDays <= 14) // Next week
        temporalDeixis = 'Next Week ' + date.getDay();
    else
      temporalDeixis = value;

    return temporalDeixis;
  }

}