import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollable]'
})
export class ScrollableDirective {

  @Output() scrollPosition = new EventEmitter();
 
  constructor(public el: ElementRef) { }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    try {
      // https://angularfirebase.com/lessons/infinite-scroll-firestore-angular/
      const top = event.target.documentElement.scrollTop; /*event.target.scrollTop;*/
      const height = this.el.nativeElement.scrollHeight;
      const offset = this.el.nativeElement.offsetHeight;

      // emit bottom event
      if (top > height - offset - 1) {
        this.scrollPosition.emit('bottom');
                console.log('bottom');

      }
     /* if ( top + window.innerHeight >= height - 1 ) {
        this.scrollPosition.emit('bottom');
        console.log('bottom');
}*/
      // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top');
         console.log('top');

      }

    } catch (err) {
        console.log('error');
    }
  }

}
