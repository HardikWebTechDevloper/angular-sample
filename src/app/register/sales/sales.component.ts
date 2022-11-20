import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';
import { DataService } from '@app/services/data.service';
import { ExciseSalesService } from '@app/services/excise-sales.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SaleSummaryComponent } from './sale-summary/sale-summary.component';
const leftArrow: string = 'assets/images/prev-arrow.svg';
const rightArrow: string = 'assets/images/next-arrow.svg';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  @ViewChild('content') public successRef: TemplateRef<object>;
  subCategoryList: any;
  selectedCategory: any;
  totalCount: number = 0;

  brands: any = [
    {
      id: 1,
    },
    { id: 2 },
  ];
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
  editCategory: string;
  editIndex: number;
  currentDate: Date = new Date();
  headerData = {
    quantity: 'SalesQTY',
    ml: 'SalesML',
  };
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
  ) {}

  ngOnInit(): void {
    this.currentDate = this._dataService.getDexpDate();
    this.route.queryParams.subscribe((params) => {
      // console.log(params, 'paramsss');
      this.invoiceNumber = params['invoice'];
      this.showExcise = params['register'];
      this.editCategory = params['category'];
      this.editIndex = params['index'];
      // console.log(this.showExcise, 'excise ------');
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
        this.headerArray = res.salesHeader;
        this.headerArray1 = res.salesRegisterHeader;
      } else {
        this.headerArray = res.salesMLHeader;
        this.headerArray1 = res.salesMLRegisterHeader;
      }
    });

    this.getAllCategories();
  }
  // Categories list of retailer
  getAllCategories() {
    const payload = {
      // InvoiceNumber: this.invoiceNumber,
    };
    this.salesService.getExciseRetailSubCategory(payload).subscribe(
      (response: any) => {
        // console.log(response, 'response ');
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
          console.log(this.totalCount, 'this.totalCount');
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
  // Excise list based on category
  getExciseList() {
    const payload = {
      SubCategory: this.selectedCategory,
      Page: this.page,
      // InvoiceNumber: this.invoiceNumber,
    };
    if (this.selectedPreference === 'C') {
      payload['allSKUs'] = 'yes';
    }
    this.spinner.show();
    this.salesService.getExciseDigitalList(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 'success' || res.status === 200) {
          this.exciseSalesList = res.data;
          this.exciseSalesList.forEach((elem: any) => {
            elem['closestockQuantity'] = elem.ClosingStockQTY;

            // if (this.RegisterType === 'Q') {
            //   if (elem['OpenStockQTY'] != null) {
            //     elem['rowValueEdited'] = true;
            //   }
            // } else {
            //   if (elem['OpenStockQTY'] != null && elem['OpenStockML'] != null) {
            //     elem['rowValueEdited'] = true;
            //   }
            // }
          });
          if (this.editCategory) {
            this.exciseSalesList = [this.exciseSalesList[this.editIndex]];
          }
          // if (!this.showExcise) {
          //   this.exciseSalesList.forEach((element: any, index: number) => {
          //     //  element['SalesML'] = element['SalesML'] ? `${element['SalesML']}` :''
          //     //  element['SalesQTY'] =  element['SalesQTY'] ? `${element['SalesQTY']}`: ''

          //     const item = this.changeddigitalExciseList.find((elem: any) => elem.SKU === element.SKU);
          //     if (item) {
          //       this.exciseSalesList[index].SalesML = item['SalesML'];
          //       this.exciseSalesList[index].SalesQTY = item['SalesQTY'];
          //     } else {
          //       if (this.exciseSalesList[index].SalesQTY > 0) {
          //         const obj = {
          //           SKU: this.exciseSalesList[index].SKU,
          //           SalesQTY: this.exciseSalesList[index].SalesQTY,
          //           SalesML: this.exciseSalesList[index].SalesML,
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
      },
      (err: any) => {
        this.spinner.hide();

        this.exciseSalesList = [];
        if (err.error.status == 'error') {
          console.log('ERROR');
          this._alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // called when page changes
  onpageChanges(page: any) {
    // this.page = pageno;
    // this.getExciseList();

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
          this.updateLicenseeSale('save');
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
  // called when category changes
  onCategorySelection(event: any) {
    console.log(event.SubCategory);
    // this.selectedCategory = event.SubCategory;
    // this.totalCount = event.TotalSKUs;
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
          this.updateLicenseeSale('save');
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
  // called when input changes on GRID
  onInputEditfn(dataEdited: any) {
    console.log(dataEdited);
    const indexvalue = this.changeddigitalExciseList.findIndex((item: any) => item.SKU === dataEdited.editedObject.SKU);
    const obj = {
      SKU: dataEdited.editedObject.SKU,
      SalesQTY: dataEdited.editedObject.SalesQTY,
      SalesML: dataEdited.editedObject.SalesML,
      SubCategory: this.selectedCategory,
    };
    // if (dataEdited.editedObject[dataEdited.fieldName]!='' && )
    if (indexvalue === -1) {
      this.changeddigitalExciseList.push(obj);
    } else {
      this.changeddigitalExciseList[indexvalue] = obj;
    }
    console.log(this.changeddigitalExciseList);
  }
  // To update the Alias
  updateSKUAlias(rowData: any) {
    const payload = {
      SKU: rowData.SKU,
      Alias: rowData.Alias,
    };
    this.spinner.show();
    this.salesService.updateSKUAlias(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
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
  // To update the licensee sales entry
  updateLicenseeSale(submittype: string) {
    const payload = {
      saleData: this.changeddigitalExciseList,
      type: submittype,
      // invoiceNumber: this.invoiceNumber,
    };
    console.log(payload);
    this.spinner.show();
    this.salesService.updateLicenseeSale(payload).subscribe(
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
  // Sales summary popup
  openSummaryPopUp() {
    const modalRef = this._modalService.open(SaleSummaryComponent, { size: 'lg' });
    const data = {
      invoice: this.invoiceNumber,
    };
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (data) => {
        // on close
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
      },
      (reason) => {
        // on dismiss
        console.log(reason);
      }
    );
  }
  // On particular Row edit
  onRowEditClick(sku: any) {
    const indexvalue = this.exciseSalesList.findIndex((item) => item.SKU === sku?.SKU);
    const filteredItems = this.exciseSalesList.filter((item) => item.SKU === sku?.SKU);
    this.exciseSalesList = filteredItems;
    this.showExcise = false;
    this.router.navigate(['/sales'], { queryParams: { category: this.selectedCategory, index: indexvalue } });
    // console.log(this.selectedCategory , '======',indexvalue)
    // console.log(filteredItems, 'oooooooooo====');
    // console.log(sku, 'oooooooooo');
  }
}
