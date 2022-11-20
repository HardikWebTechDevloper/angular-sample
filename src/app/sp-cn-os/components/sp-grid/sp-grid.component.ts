import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SkuProduct } from '@app/_models/skuproduct';

@Component({
  selector: 'app-sp-gridsss',
  templateUrl: './sp-grid.component.html',
  styleUrls: ['./sp-grid.component.scss'],
})
export class SpGridComponent implements OnInit {
  @Input() selectedData: string;
  @Input() selectedPreference: string;
  @Input() skuproductList: Array<SkuProduct> = [];
  @Input() headerData: Array<any>;
  @Input() totalCount: number;
  @Input() Ispagination: boolean = true;
  searchString: string = '';
  page: number = 1;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSKUSelect: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() onInputEdit: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onPageChanges: EventEmitter<Number> = new EventEmitter<Number>();
  disablerightArrow: boolean = false;
  disableleftArrow: boolean = false;
  mid: number;

  constructor() {}

  ngOnInit(): void {
    // if (this.skuproductList){
    //   this.disableFunc()
    // }
    this.disableFunc();
  }

  searchBasedString(searchString: string) {
    console.log(searchString);
    this.onSearch.emit(searchString);
  }
  itemSelect() {
    const filteredArray = this.skuproductList.filter((item) => item?.isSelected);
    this.onSKUSelect.emit(filteredArray.length);
  }
  prevPage() {
    this.page = this.page - 1;
    this.onPageChanges.emit(this.page);
  }
  nextPage() {
    this.page = this.page + 1;
    this.onPageChanges.emit(this.page);
  }
  enablePagination() {
    this.totalCount;
    this.skuproductList.length;
    this.page;
  }

  InputEdited(sku: any, fieldName: string, res: string, index: number) {
    console.log(sku);
    console.log(fieldName);
    if (fieldName != 'Alias') {
      const obj = {
        editedObject: sku,
        fieldName: fieldName,
      };
      this.onInputEdit.emit(sku);
    } else {
      console.log(res);
      const indexvalue = this.skuproductList.findIndex((item) => {
        if (item.SKU != sku.SKU) {
          if (item.Alias) return item.Alias === res;
        }
      });
      console.log(indexvalue, 'hhhh000');
      if (indexvalue != -1) {
        // console.log("duplicated value entered---")
        alert('Duplicate Alias entered , please enter unique Alias');
        this.skuproductList[index].Alias = '';
      }
    }
  }
  disableFunc() {
    console.log('calledduuuu');
    if (this.totalCount === this.skuproductList.length) {
      this.disableleftArrow = true;
      this.disablerightArrow = true;
    } else if (this.skuproductList.length * this.page === this.totalCount) {
      this.disableleftArrow = false;
      this.disablerightArrow = true;
    } else if (this.skuproductList.length * this.page < this.totalCount) {
      this.disableleftArrow = false;
      this.disablerightArrow = false;
    }
  }
  disablefnt() {
    // return true;
    let returnval = true;
    // console.log(this.totalCount === this.skuproductList.length);
    if (Number(this.totalCount) === Number(this.skuproductList.length)) {
      returnval = true;
    }
    if (this.page != 1) {
      returnval = false;
    }
    // console.log(returnval);
    return returnval;
  }
  disablefnright() {
    // return true;
    let returnval = false;
    // if (Number(this.totalCount) === Number(this.skuproductList.length)){
    //   returnval = true;
    //     } else
    // if(Number(this.skuproductList.length*this.page) <= Number(this.totalCount)){
    //   returnval = false;
    // }  else {
    //   returnval = true;
    // }
    this.mid = this.totalCount / 20;
    if (this.mid <= this.page) {
      returnval = true;
    } else {
      returnval = false;
    }
    // console.log(returnval);
    // console.log(this.page ,this.mid,this.page <= this.mid,'kkk');
    return returnval;
  }
  keyPressAlphaNumeric(event: any, field: string) {
    var inp = String.fromCharCode(event.keyCode);
    if (field != 'Alias') {
      if (/[0-9]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  }
}
