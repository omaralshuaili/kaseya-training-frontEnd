import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: string, ...args: unknown[]): unknown {
    return this.datePipe.transform(new Date(value), 'yyyy-MM-dd');
  }

}
