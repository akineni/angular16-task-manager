import { Pipe, PipeTransform } from '@angular/core';
import { format, differenceInCalendarDays } from 'date-fns';

@Pipe({
  name: 'temporalDeixis'
})
export class TemporalDeixisPipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): string {
    const date: Date = new Date(value!);
    const now: Date = new Date();
    const diffDays: number = differenceInCalendarDays(date, now);

    var temporalDeixis: string;

    if (diffDays == 0)
      temporalDeixis = format(date, "hh:mm a");
    else if (diffDays == -1)
      temporalDeixis = format(date, "'Yesterday at' hh:mm a");
    else if (diffDays == 1)
      temporalDeixis = format(date, "'Tomorrow at' hh:mm a");
    else if (diffDays < -1 && diffDays >= -7) { // Within last 7 days
        temporalDeixis = format(date, "'Last' EEEE 'at' hh:mm a");
    } else if (diffDays > 1 && diffDays <= 7) { // Within the next 7 days
      temporalDeixis = format(date, "EEEE 'at' hh:mm a");
      // if (diffDays <= (6 - now.getDay())) {
      //   temporalDeixis = format(date, "EEEE 'at' hh:mm a");
      // } else {
      //   temporalDeixis = format(date, "'Next' EEEE 'at' hh:mm a");
      // }
    } else if (diffDays < -7 && diffDays >= (-7 - now.getDay())) { // Last week
        temporalDeixis = format(date, "'Last Week' EEEE 'at' hh:mm a");
    } else if (diffDays > 7 && diffDays <= (7 + (6 - now.getDay()))) { // Next week
        temporalDeixis = format(date, "'Next Week' EEEE 'at' hh:mm a");
    } else
        temporalDeixis = value!;

    return temporalDeixis;
  }

}