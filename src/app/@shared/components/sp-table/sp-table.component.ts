import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sp-table',
  templateUrl: './sp-table.component.html',
  styleUrls: ['./sp-table.component.scss'],
})
export class SpTableComponent implements OnInit {
  @Input() headerData: Array<any>;
  @Input() tableArray: Array<any>;
  @Input() Ispagination: boolean;
  @Input() totalCount: number;
  @Input() page: number = 1;
  @Input() startIndex: number = 0;
  @Input() endIndex: number = 19;
  @Input() manualPagination: boolean;
  @Input() dateFormat: string = 'dd MMM yyyy';

  @Output() onPageChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectCheckbox: EventEmitter<any> = new EventEmitter<any>();
  @Output() onItemSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRouteSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddressSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPerformAction: EventEmitter<any> = new EventEmitter<any>();

  mid: number;
  pageSize: number = 20;
  orderbyInput: string;
  selectAll: boolean;

  orderbyvalue: false;
  constructor() {}

  ngOnInit(): void {}

  disablefnt() {
    let returnval = true;
    if (Number(this.totalCount) === Number(this.tableArray.length)) {
      returnval = true;
    }
    if (this.page != 1) {
      returnval = false;
    }
    return returnval;
  }
  disablefnright() {
    let returnval = false;

    this.mid = this.totalCount / 20;

    if (this.mid <= this.page) {
      returnval = true;
    } else {
      returnval = false;
    }

    return returnval;
  }
  prevPage() {
    if (this.manualPagination) {
      this.page = this.page - 1;
      this.onPageChanges.emit(this.page);
      this.startIndex = this.startIndex - this.pageSize;
      this.endIndex = this.endIndex - this.pageSize;
    } else {
      const obj = {
        pageno: this.page,
        action: 'prev',
      };
      this.onPageChanges.emit(obj);
    }
  }
  nextPage() {
    if (this.manualPagination) {
      this.page = this.page + 1;
      this.onPageChanges.emit(this.page);
      this.startIndex = this.startIndex + this.pageSize;
      this.endIndex = this.endIndex + this.pageSize;
    } else {
      const obj = {
        pageno: this.page,
        action: 'next',
      };
      this.onPageChanges.emit(obj);
    }
  }
  sortBy(fieldName: string) {
    if (this.orderbyInput === fieldName) fieldName = '';
    this.orderbyInput = fieldName;
    console.log(this.orderbyInput);
  }
  selectAllItems() {
    this.onSelectCheckbox.emit(this.selectAll);
  }
  itemSelect(data: any) {
    this.onItemSelect.emit(data);
  }
  routeTo(rowData: any) {
    this.onRouteSelect.emit(rowData);
  }
  openMap(rowData: any) {
    this.onAddressSelect.emit(rowData);
  }
  performAction(action: string, data: any) {
    const obj = {
      action: action,
      tableData: data,
    };
    this.onPerformAction.emit(obj);
  }
}
