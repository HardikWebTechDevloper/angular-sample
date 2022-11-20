import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMoveFocus]',
})
export class MoveFocusDirective {
  constructor(private _el: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyDown(e: any) {
    console.log(this._el.nativeElement.querySelector('.ng-valid'));
    if (this._el.nativeElement.querySelector('.ng-valid')) {
      if (this._el.nativeElement.querySelector('.ng-invalid')) {
        this._el.nativeElement.querySelector('.ng-invalid').focus();
      }
    }
  }
}
