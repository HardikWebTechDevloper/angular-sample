import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { ConfiguarationService } from '@app/services/configuaration.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SkuProduct } from '@app/_models/skuproduct';

@Component({
  selector: 'app-sp-grid',
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
  @Input() editSKU: boolean = false;
  @Input() searchString: string = '';
  @Input() manualPagination: boolean = false;
  @Input() page: number = 1;
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSKUSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() onInputEdit: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() onPageChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() onRowEditClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectCheckbox: EventEmitter<any> = new EventEmitter<any>();

  disablerightArrow: boolean = false;
  disableleftArrow: boolean = false;
  @Input() startIndex: number = 0;
  @Input() endIndex: number = 19;
  mid: number;
  headerIndex: number = 1;
  pageSize: number = 20;
  toggleRowHeader: boolean = true;
  isInputEdited: boolean;
  selectAll: boolean;
  constructor(
    private renderer: Renderer2,
    private notifiService: NotificationPopupService,
    private configuarationService: ConfiguarationService
  ) {}

  ngOnInit(): void {
    if (this.headerData.length != 2) {
      this.headerIndex = 0;
    }
    this.searchString = '';
    this.disableFunc();
  }

  searchBasedString(searchString: string) {
    console.log(searchString);
    this.onSearch.emit(searchString);
  }
  itemSelect(sku: any) {
    const filteredArray = this.skuproductList.filter((item) => item?.isSelected);
    this.onSKUSelect.emit(sku);
  }
  selectAllItems() {
    this.onSelectCheckbox.emit(this.selectAll);
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
  enablePagination() {
    this.totalCount;
    this.skuproductList.length;
    this.page;
  }

  InputEdited(sku: any, fieldName: string, res: string, index: number, headerData: any, eve: any) {
    if (fieldName != 'Alias') {
      const obj = {
        editedObject: sku,
        fieldName: fieldName,
      };

      if (headerData.checkValidation) {
        console.log(sku.Size);
        let totalSize;
        const mlVal = sku[headerData['fieldName']];

        let checkValidation: boolean;
        totalSize = sku.Size - 30;
        const multipleOften = mlVal % 10 == 0;
        console.log(multipleOften, 'multipleOften');
        checkValidation = mlVal >= 10 && mlVal <= totalSize;

        if (checkValidation && multipleOften) {
          if (this.isInputEdited) {
            this.isInputEdited = false;
            this.onInputEdit.emit(obj);
          }
        } else {
          if (this.skuproductList[index][fieldName]) {
            const alertObj = {
              title: 'Alert',
              text:
                'Enter valid a ML and ML should be greater than 10 and below ' +
                totalSize +
                ' and  should be multiple of 10',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK',
              cancelButtonText: 'No, keep it',
            };
            this.renderer.selectRootElement('#' + fieldName + index).focus();
            this.skuproductList[index][fieldName] = 0;
            this.notifiService.openAlert(alertObj);
          }
          this.skuproductList[index][fieldName] = 0;
        }
      } else if (headerData.checkQTYValidation) {
        const qtyVal = sku[headerData['fieldName']];
        let stockOnHand = sku[headerData['addField']] + sku[headerData['secaddField']];
        const closingStock = sku[headerData['thirdaddField']];
        if (headerData.closingStockValidation) {
          if (closingStock >= 0 && closingStock <= stockOnHand) {
            stockOnHand = stockOnHand - closingStock;
          }
        }

        if (qtyVal > stockOnHand) {
          const alertObj = {
            title: 'Alert',
            text: 'Enter valid a Quantity, Quantity should be  lesser than or equal to Stock On Hand ' + stockOnHand,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'OK',
            cancelButtonText: 'No, keep it',
          };
          this.renderer.selectRootElement('#' + fieldName + index).focus();
          if (closingStock && !headerData.closingStockValidation) {
            this.skuproductList[index][fieldName] = closingStock;
            if (closingStock >= qtyVal) {
              this.skuproductList[index][fieldName] = 0;
            }
          } else {
            this.skuproductList[index][fieldName] = 0;
          }

          this.notifiService.openAlert(alertObj);
        } else {
          if (this.skuproductList[index][fieldName] === '') {
            this.skuproductList[index][fieldName] = 0;
          }
          // this.onInputEdit.emit(obj);
          if (this.isInputEdited) {
            this.isInputEdited = false;
            this.onInputEdit.emit(obj);
          }
        }
      } else {
        if (this.skuproductList[index][fieldName] === '') {
          this.skuproductList[index][fieldName] = 0;
        }
        // this.onInputEdit.emit(obj);
        if (this.isInputEdited) {
          this.isInputEdited = false;
          this.onInputEdit.emit(obj);
        }
      }
    } else {
      console.log(res);
      const indexvalue = this.skuproductList.findIndex((item) => {
        if (item.SKU != sku.SKU) {
          if (item.Alias) return item.Alias === res;
        }
      });
      console.log(indexvalue, 'hhhh000');
      if (indexvalue != -1) {
        const alertObj = {
          title: 'Alert',
          text: 'Duplicate Alias entered , please enter unique Alias',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK',
          cancelButtonText: 'No, keep it',
        };
        this.skuproductList[index].Alias = '';
        this.renderer.selectRootElement('#' + fieldName + index).focus();
        this.notifiService.openAlert(alertObj);
        console.log(fieldName + index);
      }
      if (indexvalue === -1) {
        const obj = {
          editedObject: sku,
          fieldName: fieldName,
        };
        if (res) {
          const payload = {
            Alias: res,
            SKU: sku.SKU,
          };
          this.configuarationService.checkSKUAlias(payload).subscribe(
            (res: any) => {
              if (res.status === 'success' || res.status === 200) {
                if (this.isInputEdited) {
                  this.isInputEdited = false;
                  this.onInputEdit.emit(obj);
                }
              } else {
                const alertObj = {
                  title: 'Alert',
                  text: 'Duplicate Alias entered , please enter unique Alias',
                  icon: 'warning',
                  showCancelButton: false,
                  confirmButtonText: 'OK',
                  cancelButtonText: 'No, keep it',
                };
                this.skuproductList[index].Alias = '';
                this.renderer.selectRootElement('#' + fieldName + index).focus();
                this.notifiService.openAlert(alertObj);
              }
            },
            (err: any) => {
              const alertObj = {
                title: 'Error',
                text: err.data.error,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK',
              };
              this.skuproductList[index].Alias = '';
              this.renderer.selectRootElement('#' + fieldName + index).focus();
              this.notifiService.openAlert(alertObj);
            }
          );
        }
      }
    }
  }
  onFocus(sku: any, fieldName: string, res: string, index: number, headerData: any) {
    if (fieldName != 'Alias') {
      if (Number(this.skuproductList[index][fieldName]) === 0) this.skuproductList[index][fieldName] = '';
    }
  }
  postTestChanged(event: any) {
    console.log(event, 'prev');
  }
  preTextChanged(event: any) {
    this.isInputEdited = true;
    console.log(event, 'current');
  }
  disableFunc() {
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
    let returnval = true;
    if (Number(this.totalCount) === Number(this.skuproductList.length)) {
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
  keyPressAlphaNumeric(event: any, field: string, headerData: any) {
    const inp1 = String.fromCharCode(event.keyCode);
    let regex,
      regex1 = /[0-9]/;
    if (headerData.checkValidation) {
      regex = /^[0-9]{0,3}$/;
    } else {
      regex = /^[0-9]{0,5}$/;
    }
    const inp = event.target.value;
    if (field != 'Alias') {
      if (regex.test(inp) && regex1.test(inp1)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  }
  editRow(sku: object) {
    this.onRowEditClick.emit(sku);
  }
  toggleHeader() {
    this.toggleRowHeader = !this.toggleRowHeader;
  }
}
