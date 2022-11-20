import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { ConfiguarationService } from '@app/services/configuaration.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { salesIvoice } from '@app/_models/exciseregister';
import { OwlOptions } from 'ngx-owl-carousel-o';
const leftArrow: string = 'assets/images/prev-arrow.svg';
const rightArrow: string = 'assets/images/next-arrow.svg';
@Component({
  selector: 'app-sp-single-item',
  templateUrl: './sp-single-item.component.html',
  styleUrls: ['./sp-single-item.component.scss'],
})
export class SpSingleItemComponent implements OnInit {
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
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
    nav: true,
  };
  @Input() resultArray: Array<salesIvoice> = [];
  @Input() registerType: string = '';
  @Input() enteredLen: number = 0;
  @Input() displayText: string = '';
  @Input() displayStock: boolean = false;
  @Input() headerData: any;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAliasChage: EventEmitter<any> = new EventEmitter<any>();
  @Output() onInputChange: EventEmitter<any> = new EventEmitter<any>();
  indexValue: number = 1;

  constructor(
    private renderer: Renderer2,
    private notifiService: NotificationPopupService,
    private configuarationService: ConfiguarationService
  ) {}

  ngOnInit(): void {}
  submitSalesData() {
    this.onSubmit.emit(this.resultArray);
  }
  updateAlias(rowData: any, index: number) {
    const indexvalue = this.resultArray.findIndex((item) => {
      if (item.SKU != rowData.SKU) {
        if (item.Alias) return item.Alias === rowData.Alias;
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
      this.resultArray[index].Alias = '';
      rowData.editable = true;
      this.renderer.selectRootElement('#Alias' + index).focus();
      this.notifiService.openAlert(alertObj);
    }
    if (indexvalue === -1) {
      if (rowData.Alias) {
        const payload = {
          Alias: rowData.Alias,
          SKU: rowData.SKU,
        };
        this.configuarationService.checkSKUAlias(payload).subscribe(
          (res: any) => {
            if (res.status === 'success' || res.status === 200) {
              this.onAliasChage.emit(rowData);
              rowData.editable = false;
            } else {
              const alertObj = {
                title: 'Alert',
                text: 'Duplicate Alias entered , please enter unique Alias',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonText: 'OK',
                cancelButtonText: 'No, keep it',
              };
              this.resultArray[index].Alias = '';
              this.renderer.selectRootElement('#Alias' + index).focus();
              rowData.editable = true;
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
            this.resultArray[index].Alias = '';
            this.renderer.selectRootElement('#Alias' + index).focus();
            this.notifiService.openAlert(alertObj);
          }
        );
      }
    }
  }
  keyPressAlphaNumeric(event: any) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  InputEdited(data: any, fieldName: string, index: number, label: string, headerData: any) {
    const obj = {
      editedObject: data,
      fieldName: fieldName,
    };
    if (label === 'ml') {
      let totalSize;
      const mlVal = data[fieldName];
      let checkValidation: boolean;
      totalSize = data.Size - 30;
      const multipleOften = mlVal % 10 == 0;
      checkValidation = mlVal >= 10 && mlVal <= totalSize;
      if (checkValidation && multipleOften) {
        this.onInputChange.emit(obj);
      } else {
        if (this.resultArray[index][fieldName]) {
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
          this.resultArray[index][fieldName] = 0;
          this.notifiService.openAlert(alertObj);
        }
        this.resultArray[index][fieldName] = 0;
      }
    } else {
      let onHand = data.PurchaseQTY + data.OpenStockQTY;
      const closingStock = data.closestockQuantity;
      if (!this.displayStock) {
        if (closingStock >= 0 && closingStock <= onHand) {
          onHand = onHand - closingStock;
        }
      }

      const qtyVal = data[fieldName];
      if (qtyVal > onHand) {
        const alertObj = {
          title: 'Alert',
          text: 'Enter valid a Quantity, Quantity should be  lesser than or equal to Stock On Hand ' + onHand,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK',
          cancelButtonText: 'No, keep it',
        };
        this.renderer.selectRootElement('#' + fieldName + index).focus();

        if (closingStock && !this.displayStock) {
          this.resultArray[index][fieldName] = closingStock;
          if (closingStock >= qtyVal) {
            this.resultArray[index][fieldName] = 0;
          }
        } else {
          this.resultArray[index][fieldName] = 0;
        }

        this.notifiService.openAlert(alertObj);
      } else {
        if (this.resultArray[index][fieldName] === '') {
          this.resultArray[index][fieldName] = 0;
        }
        this.onInputChange.emit(obj);
      }
    }
  }
  onFocus(fieldName: string, index: number) {
    if (fieldName != 'Alias') {
      if (Number(this.resultArray[index][fieldName]) === 0) this.resultArray[index][fieldName] = '';
    }
  }
  getData(eve: any) {
    this.indexValue = eve.startPosition + 1;
  }
}
