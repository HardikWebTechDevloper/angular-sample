import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';
import { DataService } from '@app/services/data.service';
import { ExciseSalesService } from '@app/services/excise-sales.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { StockSummaryComponent } from './stock-summary/stock-summary.component';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  @ViewChild('content') public successRef: TemplateRef<Object>;

  subCategoryList: any;
  selectedCategory: any;
  totalCount: number = 0;
  page: number = 1;
  exciseSalesList: Array<any> = [];
  RegisterType: string;
  headerArray: any = [];
  headerArray1: any = [];
  changeddigitalExciseList: any = [];
  invoiceNumber: number;
  selectedPreference: string = '';
  reviewCategory: any = [];
  showExcise: boolean = false;
  currentDate: Date = new Date();
  headerData = {
    quantity: 'ClosingStockQTY',
    ml: 'ClosingStockML',
  };
  editCategory: string;
  editIndex: number;
  disableSubmitBtn: boolean = true;
  constructor(
    private salesService: ExciseSalesService,
    private _dataService: DataService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
    private _modalService: NgbModal,
    private spinner: SpinnerService,
    private _alertService: AlertService,
    private notifiService: NotificationPopupService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
      }
    });
  }

  ngOnInit(): void {
    this.currentDate = this._dataService.getDexpDate();
    this.route.queryParams.subscribe((params) => {
      this.invoiceNumber = params['invoice'];
      this.showExcise = params['register'];
      this.editCategory = params['category'];
      this.editIndex = params['index'];
      if (this.showExcise) {
        this.page = 1;
        this.getExciseList();
      }
    });
    const licenseeData = this.cookieService.get('licenseeDetails');
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.selectedPreference = descyptedData?.EntryPreference;
      this.RegisterType = descyptedData?.RegisterType;
    }
    this._dataService.getHeaderData().subscribe((res: any) => {
      if (this.RegisterType === 'Q') {
        this.headerArray = res.stockHeader;
        this.headerArray1 = res.salesRegisterHeader;
      } else {
        this.headerArray = res.stockMLHeader;
        this.headerArray1 = res.salesMLRegisterHeader;
      }
    });
    this.getAllCategories();
    this.getEnableStatus();
  }
  // To get all categories of retailer
  getAllCategories() {
    const payload = {
      // InvoiceNumber: this.invoiceNumber,
    };
    this.salesService.getExciseRetailSubCategory(payload).subscribe(
      (response: any) => {
        console.log(response, 'response ');
        if (response.status === 200) {
          this.subCategoryList = response.data;
          this.subCategoryList.forEach((item: any) => {
            const obj = {};
            obj[item.SubCategory] = [];
            this.reviewCategory.push(obj);
          });
          for (let i = 0; i < this.subCategoryList.length; i++) {
            if (this.subCategoryList[i].TotalSKUs > 0) {
              this.selectedCategory = this.subCategoryList[i].SubCategory;
              this.totalCount = this.subCategoryList[i].TotalSKUs;
              break;
            }
          }
          if (this.totalCount === 0) {
            this.selectedCategory = this.subCategoryList[0].SubCategory;
            this.totalCount = this.subCategoryList[0].TotalSKUs;
          }
          if (this.editCategory) {
            const filteredItems = this.subCategoryList.filter((elem: any) => elem.SubCategory === this.editCategory);
            this.selectedCategory = filteredItems[0].SubCategory;
            this.totalCount = filteredItems[0].TotalSKUs;
          }
          // this.selectedCategory = this.subCategoryList[0].SubCategory;
          // this.totalCount = this.subCategoryList[0].TotalSKUs;
          this.getExciseList();
        } else {
          this.subCategoryList = [];
        }
      },
      (err: any) => {
        this.subCategoryList = [];
      }
    );
  }
  // To get Excise list based on category
  getExciseList() {
    const payload = {
      SubCategory: this.selectedCategory,
      Page: this.page,
    };
    if (this.selectedPreference === 'C') {
      payload['allSKUs'] = 'yes';
    }
    this.spinner.show();
    this.salesService.getExciseDigitalList(payload).subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
          this.exciseSalesList = res.data;
          this.exciseSalesList.forEach((elem: any) => {
            elem['closestockQuantity'] = elem.ClosingStockQTY;
            if (this.RegisterType === 'Q') {
              if (elem['ClosingStockQTY'] != null) {
                elem['rowValueEdited'] = true;
              }
            } else {
              if (elem['ClosingStockQTY'] != null && elem['ClosingStockML'] != null) {
                elem['rowValueEdited'] = true;
              }
            }
          });
          if (this.editCategory) {
            this.exciseSalesList = [this.exciseSalesList[this.editIndex]];
          }
          // if (!this.showExcise) {

          //   this.exciseSalesList.forEach((element: any, index: number) => {

          //     const item = this.changeddigitalExciseList.find((elem: any) => elem.SKU === element.SKU);
          //     if (item) {
          //       this.exciseSalesList[index].ClosingStockML = item['CloseML'];
          //       this.exciseSalesList[index].ClosingStockQTY = item['CloseQTY'];
          //     } else {
          //       if (this.exciseSalesList[index].CloseQTY > 0) {
          //         const obj = {
          //           SKU: this.exciseSalesList[index].SKU,
          //           CloseQTY: this.exciseSalesList[index].ClosingStockQTY,
          //           CloseML: this.exciseSalesList[index].ClosingStockML,
          //           SubCategory: this.selectedCategory,
          //         };
          //         this.changeddigitalExciseList.push(obj);
          //       }
          //     }
          //   });
          // }
        } else {
          this.exciseSalesList = [];
        }
        this.spinner.hide();
      },
      (err: any) => {
        this.exciseSalesList = [];
        this.spinner.hide();
        if (err.error.status == 'error') {
          console.log('ERROR');
          this._alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // Called when page gets changed
  onpageChanges(page: any) {
    if (this.changeddigitalExciseList.length > 0) {
      this.selectedCategory = this.selectedCategory;
      this.totalCount = this.totalCount;
      this.page = this.page;
      const alertObj = {
        title: '',
        text: 'You have made changes please save it or changes will be lost',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      };
      this.notifiService.openAlert(alertObj).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.updateLicenseeCloseStock('save');
          console.log('Saved!');
        } else if (result.isDismissed) {
          // this.valuesChanged=false;
          this.changeddigitalExciseList = [];
          if (page.action === 'next') {
            this.page = page.pageno + 1;
          } else {
            this.page = page.pageno - 1;
          }

          this.getExciseList();
        }
      });
    } else {
      // this.page = page.pageno;
      if (page.action === 'next') {
        this.page = page.pageno + 1;
      } else {
        this.page = page.pageno - 1;
      }
      this.getExciseList();
    }
  }
  // Called when category gets changed
  onCategorySelection(event: any) {
    // console.log(event.SubCategory);
    // this.selectedCategory = event.SubCategory;
    // this.getExciseList();

    if (this.changeddigitalExciseList.length > 0) {
      this.selectedCategory = this.selectedCategory;
      this.totalCount = this.totalCount;
      const alertObj = {
        title: '',
        text: 'You have made changes please save it or changes will be lost',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      };
      this.notifiService.openAlert(alertObj).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        console.log(result, 'kkkk');
        if (result.isConfirmed) {
          this.updateLicenseeCloseStock('save');
          console.log('Saved!');
        } else if (result.isDismissed) {
          // this.valuesChanged=false;
          this.changeddigitalExciseList = [];
          this.selectedCategory = event.SubCategory;
          this.totalCount = event.TotalSKUs;
          this.page = 1;
          this.getExciseList();
        }
      });
    } else {
      this.selectedCategory = event.SubCategory;
      this.totalCount = event.TotalSKUs;
      this.page = 1;
      this.getExciseList();
    }
  }
  // Called when input value gets changed in the GRID
  onInputEditfn(dataEdited: any) {
    console.log(dataEdited);
    console.log(this.changeddigitalExciseList);
    const indexvalue = this.changeddigitalExciseList.findIndex((item: any) => item.SKU === dataEdited.editedObject.SKU);
    const obj = {
      SKU: dataEdited.editedObject.SKU,
      CloseQTY: dataEdited.editedObject.ClosingStockQTY,
      CloseML: dataEdited.editedObject.ClosingStockML,
      // SubCategory: this.selectedCategory,
    };

    if (indexvalue === -1) {
      this.changeddigitalExciseList.push(obj);
    } else {
      this.changeddigitalExciseList[indexvalue] = obj;
    }
    console.log(this.changeddigitalExciseList);
    this.exciseSalesList.forEach((elem: any) => {
      if (elem.SKU === dataEdited.editedObject.SKU) {
        if (this.RegisterType === 'Q') {
          if (elem['ClosingStockQTY'] != null) {
            elem['rowValueEdited'] = true;
          }
        } else {
          if (elem['ClosingStockQTY'] != null && elem['ClosingStockML'] != null) {
            elem['rowValueEdited'] = true;
          }
        }
      }
    });
  }
  enableSaveBtn() {
    let returnVal = true;
    const totalCount = this.exciseSalesList.length;
    const rowEditedLen = this.exciseSalesList.filter((elem: any) => elem.rowValueEdited === true);
    if (totalCount === rowEditedLen.length) returnVal = false;
    return returnVal;
    // console.log(totalCount ,"totalCount----- rowEditedLen" ,rowEditedLen.length)
  }
  // To update the alias
  updateSKUAlias(rowData: any) {
    const payload = {
      SKU: rowData.SKU,
      Alias: rowData.Alias,
    };
    this.salesService.updateSKUAlias(payload).subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
          const alertObj = {
            title: '',
            text: 'Alias updated',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        } else {
          const alertObj = {
            title: '',
            text: res.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      },
      (err: any) => {
        this.spinner.hide();
        if (err.error.status == 'error') {
          console.log('ERROR');
          // this._alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: err.error.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      }
    );
  }
  // To update the stock entries
  updateLicenseeCloseStock(submittype: string) {
    const payload = {
      closeData: this.changeddigitalExciseList,
      type: submittype,
    };
    console.log(payload);
    this.spinner.show();
    this.salesService.updateLicenseeCloseStock(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 'success' || res.status === 200) {
          this.changeddigitalExciseList = [];
          // this._alertService.success('Data updated', { keepAfterRouteChange: true, autoClose: true });
          if (submittype === 'submit') {
            this.page = 1;
            this.router.navigate([], {
              queryParams: {
                register: true,
              },
            });
          } else {
            this.getExciseList();
            this.getEnableStatus();
            const alertObj = {
              title: '',
              text: 'Data updated',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            };
            this.notifiService.openAlert(alertObj);
          }
        } else {
          // this._alertService.error(res.data.error, { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: res.data.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      },
      (err: any) => {
        this.spinner.hide();
        if (err.error.status == 'error') {
          console.log('ERROR');
          // this._alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
          const alertObj = {
            title: '',
            text: err.error.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      }
    );
  }
  // To open stock summary popup
  openSummaryPopUp() {
    const modalRef = this._modalService.open(StockSummaryComponent, { size: 'lg' });
    const data = {
      invoice: this.invoiceNumber,
    };
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (data) => {
        // on close
        console.log(data, 'data---');
        if (data === 'success') {
          const modalRefs = this._modalService.open(this.successRef, { size: 'lg' });
          modalRefs.result.then(
            (data) => {
              console.log('close');
              this.router.navigate(['/']);
            },
            (reason) => {
              this.router.navigate(['/']);
            }
          );
        }
        if (data === 'error') {
          // this.router.navigate(['/'])
        }
      },
      (reason) => {
        // on dismiss
        console.log(reason);
      }
    );
  }
  // Edit Single row in excise list
  onRowEditClick(sku: any) {
    const indexvalue = this.exciseSalesList.findIndex((item) => item.SKU === sku?.SKU);
    const filteredItems = this.exciseSalesList.filter((item) => item.SKU === sku?.SKU);
    this.exciseSalesList = filteredItems;
    this.showExcise = false;
    this.router.navigate(['/stock'], { queryParams: { category: this.selectedCategory, index: indexvalue } });
    console.log(filteredItems, 'oooooooooo====');
    console.log(sku, 'oooooooooo');
  }

  // get submit enable button
  getEnableStatus() {
    this.salesService.getEnableStatus().subscribe(
      (res: any) => {
        console.log(res, 'button res');
        if (res.status === 200 || res.status === 'success') {
          const closingStock = res.data[0].ClosingStock;
          if (closingStock == 0) {
            this.disableSubmitBtn = false;
          } else {
            this.disableSubmitBtn = true;
          }
        } else {
          this.disableSubmitBtn = true;
        }
      },
      (err: any) => {
        this.disableSubmitBtn = true;
      }
    );
  }
}
