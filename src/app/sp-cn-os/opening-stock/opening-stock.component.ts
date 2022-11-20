import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';
import { DataService } from '@app/services/data.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { OpeningStockService } from '@app/services/opening-stock.service';
import { SpinnerService } from '@app/services/spinner.service';
import { category, changeddigitalExcise, digitalExcise } from '@app/_models/skuproduct';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { SummaryPopupComponent } from './summary-popup/summary-popup.component';
@Component({
  selector: 'app-opening-stock',
  templateUrl: './opening-stock.component.html',
  styleUrls: ['./opening-stock.component.scss'],
})
export class OpeningStockComponent implements OnInit {
  public selectedlicensee: string = 'sales';
  public goLiveDate: Date;
  page: number = 1;
  subCategoryList: Array<category>;
  currentDate = new Date();
  headerArray: any = [];
  selectedCategory: string;
  digitalExciseList: Array<digitalExcise> = [];
  changeddigitalExciseList: Array<changeddigitalExcise> = [];
  totalCount: number = 0;
  reviewCategory: any = [];
  RegisterType: string;
  isLoaded: boolean;
  @ViewChild('content') private successRef: TemplateRef<object>;

  constructor(
    private _modalService: NgbModal,
    private _dataService: DataService,
    private _stockService: OpeningStockService,
    private _cookieService: CookieService,
    private alertService: AlertService,
    private spinner: SpinnerService,
    private notifiService: NotificationPopupService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const licenseeData = this._cookieService.get('licenseeDetails');
    console.log(licenseeData);
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.selectedlicensee = descyptedData?.LicenseType;
      this.RegisterType = descyptedData.RegisterType;
      this.goLiveDate = descyptedData?.GoLiveDate;
    }

    this._dataService.getHeaderData().subscribe((res: any) => {
      if (this.RegisterType === 'Q') {
        this.headerArray = res.openingStockCl2Header;
      } else {
        this.headerArray = res.openingStockCl9Header;
      }
    });
    this.getAllCategories();
  }
  // To get All categories of Reatiler
  getAllCategories() {
    this._stockService.getRetailCategory().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.subCategoryList = response.data;
          this.subCategoryList.forEach((item) => {
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
          this.getAllDigitalExcise();
        } else {
        }
      },
      (err: any) => {
        if (err.error.status == 'error') {
          this.alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // To get Excise list based on the Category
  getAllDigitalExcise() {
    this.spinner.show();
    const payload = {
      SubCategory: this.selectedCategory,
    };
    this.isLoaded = false;
    this._stockService.getAllDigitalExcise(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          //     this.digitalExciseList = res.data;
          // // this.totalCount = this.digitalExciseList
          res.data.forEach((element: any) => {
            if (!element.OpenStockQTY) element.OpenStockQTY = 0;
            if (!element.OpenStockML) element.OpenStockML = 0;
          });
          console.log(res.data);
          this.reviewCategory.forEach((element: any) => {
            if (element[this.selectedCategory]) {
              if (element[this.selectedCategory].length === 0) {
                element[this.selectedCategory] = res.data;
                this.digitalExciseList = res.data;
              } else {
                this.digitalExciseList = element[this.selectedCategory];
              }
              this.totalCount = element[this.selectedCategory].length;
            }
          });
        } else {
          this.digitalExciseList = [];
        }
        this.isLoaded = true;
        this.spinner.hide();
      },
      (err: any) => {
        this.spinner.hide();
        this.digitalExciseList = [];
        this.isLoaded = true;
        if (err.error.status == 'error') {
          this.alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // To Open Summary popup
  openSummaryPopup() {
    const modalRef = this._modalService.open(SummaryPopupComponent, { size: 'lg' });
    const data = {
      reviewCategory: this.reviewCategory,
    };
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (data) => {
        // on close
        if (data === 'saveandsubmit') {
          this.saveDigitalExcise('submit');
        }
      },
      (reason) => {
        // on dismiss
        console.log(reason);
      }
    );
  }
  // To save opening stock
  saveDigitalExcise(submittype: string) {
    const payload = {
      data: this.changeddigitalExciseList,
      type: submittype,
    };
    this._stockService.saveDigitalExcise(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          if (submittype === 'submit') {
            const modalRef = this._modalService.open(this.successRef);
            modalRef.result.then(
              (data) => {
                // on close
                this.router.navigate(['/']);
              },
              (reason) => {
                // on dismiss
                this.router.navigate(['/']);
                console.log(reason);
              }
            );
          } else {
            const alertObj = {
              title: '',
              text: 'Opening stock data saved',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            };
            this.notifiService.openAlert(alertObj);
          }

          // this.alertService.success('Error in updating details', { keepAfterRouteChange: true, autoClose: true });
        } else {
          // this.alertService.error(res.data.error, { keepAfterRouteChange: true, autoClose: true });
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
          const alertObj = {
            title: '',
            text: err.error.error,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          // this.alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // Called when category changes happen
  onCategorySelection(event: category) {
    this.selectedCategory = event.SubCategory;
    this.getAllDigitalExcise();
  }

  // Called when input changes on GRID
  onInputEditfn(dataEdited: any) {
    const indexvalue = this.changeddigitalExciseList.findIndex((item) => item.SKU === dataEdited.editedObject.SKU);
    const obj = {
      SKU: dataEdited.editedObject.SKU,
      oStockQTY: dataEdited.editedObject.OpenStockQTY,
      oStockML: dataEdited.editedObject.OpenStockML,
      SubCategory: this.selectedCategory,
    };
    if (indexvalue === -1) {
      this.changeddigitalExciseList.push(obj);
    } else {
      this.changeddigitalExciseList[indexvalue] = obj;
    }
  }
}
