import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { category } from '@app/_models/skuproduct';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';

const leftArrow: string = 'assets/images/left-arrow-white.png';
const rightArrow: string = 'assets/images/right-arrow-white.png';

@Component({
  selector: 'app-sp-category',
  templateUrl: './sp-category.component.html',
  styleUrls: ['./sp-category.component.scss'],
})
export class SpCategoryComponent {
  @Input() brands: category[];
  @Input() selectedCategory: string;
  @Output() onSelect: EventEmitter<category> = new EventEmitter<category>();

  activeTab: Number = 1;
  customOptions: OwlOptions = {
    autoWidth: true,
    loop: true,
    center: false,
    dots: false,
    merge: true,
    margin: 0,
    nav: true,
    navText: ['<img id="prevIcon" src="' + leftArrow + '">', '<img id="nextIcon" src="' + rightArrow + '">'],
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 10,
      },
    },
  };

  constructor() {}

  selectCategory(selectedCat: category) {
    this.onSelect.emit(selectedCat);
  }

  getActiveItem(iconType: string) {
    const selectedItem = document.getElementsByClassName('item-active');
    let nextItem: any;
    if (iconType === 'next') nextItem = parseInt(selectedItem[0].getAttribute('id')) + 1;
    else nextItem = parseInt(selectedItem[0].getAttribute('id')) - 1;
    const item = document.getElementById(nextItem);
    let activeItem;
    for (let i = 0; i <= this.brands.length; i++) {
      const item = document.getElementById(nextItem);
      const totalcount: any = item.getAttribute('totalskus');
      if (totalcount > 0) {
        if (iconType === 'next') activeItem = parseInt(item.getAttribute('id'));
        else activeItem = parseInt(item.getAttribute('id'));
        document.getElementById('' + activeItem).click();
        break;
      } else {
        if (iconType === 'next') nextItem = nextItem + 1;
        else nextItem = nextItem - 1;
      }
    }
  }

  onClick(event: any) {
    if (event.target.src) {
      console.log(event.target.src, 'event');
      const owlPrev = document.getElementsByClassName('owl-prev')[0].getAttribute('class');
      const owlNext = document.getElementsByClassName('owl-next')[0].getAttribute('class');
      if (event.target.src.includes('right-arrow-white.png') && !owlNext.includes('disabled')) {
      } else if (event.target.src.includes('left-arrow-white.png') && !owlPrev.includes('disabled')) {
      }
    }
  }
  getPassedData(data: SlidesOutputData) {
    const indexval: any = data?.startPosition;
    const item: any = document.getElementById(indexval);
    const totalcount: any = item.getAttribute('totalskus');
    if (totalcount > 0) {
      const activeItem = parseInt(item.getAttribute('id'));
      document.getElementById('' + activeItem).click();
    } else {
    }
  }
  getData(data: SlidesOutputData) {
    console.log(data);
  }
}
