import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderby',
})
export class OrderbyPipe implements PipeTransform {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a[args] < b[args]) {
        return -1;
      } else if (a[args] >= b[args]) {
        return 1;
      }
    });
    return array;
  }
  private sortAray(array: any, field: any) {
    return array.sort((a: any, b: any) => {
      if (typeof a[field] !== 'string') {
        a[field] !== b[field] ? (a[field] < b[field] ? -1 : 1) : 0;
      } else {
        a[field].toLowerCase() !== b[field].toLowerCase()
          ? a[field].toLowerCase() < b[field].toLowerCase()
            ? -1
            : 1
          : 0;
      }
    });
  }
}
