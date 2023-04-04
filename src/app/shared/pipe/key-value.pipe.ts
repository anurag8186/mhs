import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue',
  pure: false
})
export class KeyValuePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
