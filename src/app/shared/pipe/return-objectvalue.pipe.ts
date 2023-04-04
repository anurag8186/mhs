import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'returnObjectvalue'
})
export class ReturnObjectvaluePipe implements PipeTransform {

   transform(scoreOption) : any {
    let obj = {};
    let keysValues:any = [];

  

    for (let value in scoreOption) {
      if (scoreOption.hasOwnProperty(value)) {
        keysValues.push(scoreOption[value]);
      }
     
    }
    console.log(keysValues);
    return keysValues;
  }

}
