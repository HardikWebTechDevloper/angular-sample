import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { category } from '@app/_models/skuproduct';
import { OwlOptions } from 'ngx-owl-carousel-o';
const leftArrow: string = 'assets/images/left-arrow-white.png';
const rightArrow: string = 'assets/images/right-arrow-white.png';
@Component({
  selector: 'app-sp-categorys',
  templateUrl: './sp-category.component.html',
  styleUrls: ['./sp-category.component.scss'],
})
export class SpCategoryComponent implements OnInit {
  @Input() brands: Array<category>;
  @Input() selectedCategory: string;
  activeTab = 1;
  customOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    center: false,
    dots: false,

    margin: 20,
    navText: ['<img src="' + leftArrow + '">', '<img src="' + rightArrow + '">'],
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 4,
      },
      1000: {
        items: 9,
      },
    },
    nav: true,
  };
  @Output() onSelect: EventEmitter<category> = new EventEmitter<category>();

  constructor() {}

  ngOnInit(): void {}
  selectCategory(selectedCat: category) {
    // console.log('selected', selectedCat);
    this.selectedCategory = selectedCat.SubCategory;
    this.onSelect.emit(selectedCat);
  }

  getData(event: any) {
    console.log(event);
    if (event.slides.length > 0) {
      const index = this.brands.findIndex((item) => item.SubCategory === this.selectedCategory);
      console.log(index, 'kkkkk');
      // const res=   this.brands[index+1]
      // this.selectCategory(res)
    }
  }
}
