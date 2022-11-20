import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '@app/services/alert.service';
import { DataService } from '@app/services/data.service';
import { ExcisePuchaseService } from '@app/services/excise-puchase.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { PurchaseConfimationComponent } from './purchase-confimation/purchase-confimation.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
  puchase_Status: boolean = false;
  InvoceNumber: number;
  selectedInvoice: Array<any> = [];
  InvoiceForm = new FormGroup({
    // Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
    InvoceNumber: new FormControl('', [Validators.required]),
  });

  invoiceDate: Date;
  invoiceList: any = [];
  currentDate: Date = new Date();
  errMsg: string = '';
  errlastUpdatedMsg: string = '';
  selectedData: string;
  selectedProcess = 'U';
  stockTab: boolean = false;
  headerArray: Array<any> = [];
  headerArray1: Array<any> = [];
  enablePurchase: boolean;
  page = 1;
  totalCount = 0;
  constructor(
    private purchaseService: ExcisePuchaseService,
    private alertService: AlertService,
    private _modalService: NgbModal,
    private spinner: SpinnerService,
    private router: Router,
    private cookieService: CookieService,
    private notifiService: NotificationPopupService,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
    const licenseeData = this.cookieService.get('licenseeDetails');
    console.log(licenseeData);
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      console.log(descyptedData, 'descyptedData---');
      this.selectedData = descyptedData?.DataEntry;
      if (this.selectedData === 'S') {
        this.stockTab = true;
      }
    }
    this.purchaseService.getdigitalDetail().subscribe(
      (res: any) => {
        if (res['status'] === 'success' || res['status'] === 200) {
          this.invoiceDate = res.data[0].InvoiceDate;
          if (res.data[0].Status === 'F') {
            this.router.navigate(['/store-profile']);
          }
        } else {
        }
      },
      (err: any) => {}
    );

    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.invoiceHeader;
      console.log(this.headerArray);
    });
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray1 = res.invoiceProcessHeader;
    });
    this.getInvoiceData();
  }
  get invoiceFormControl() {
    return this.InvoiceForm.controls;
  }
  // To get the purchase status
  puchaseStatus(val: boolean) {
    this.puchase_Status = val;
    this.errlastUpdatedMsg = '';
    if (!val) {
      this.getLastupdated();
    }
  }
  // To get the last updated purchase status and Do routing
  getLastupdated() {
    this.spinner.show();
    this.purchaseService.getdigitalLastUpdated().subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          if (res.data.action === 'moveSale') {
            if (this.selectedData === 'T') {
              this.router.navigate(['/sales']);
            } else {
              this.router.navigate(['/stock']);
            }
          } else if (res.data.action === 'moveDexExcise') {
            const alertObj = {
              title: '',
              text: res.data.message,
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK',
            };
            this.notifiService.openAlert(alertObj);
            this.router.navigate(['/configuration']);
          } else {
            // movePurchase
            const alertObj = {
              title: '',
              text: res.data.message,
              icon: 'warning',
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
          // this.alertService.error(res.data.error, { keepAfterRouteChange: true, autoClose: true });
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
          // this.alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // To Validate the given invoice
  validateInvoice() {
    const payload = {
      invoiceNumber: this.InvoiceForm.value.InvoceNumber,
    };
    this.spinner.show();
    this.InvoceNumber = this.InvoiceForm.value.InvoceNumber;
    this.purchaseService.validateInvoiceumber(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 'success' || res.status === 200) {
          this.InvoiceForm.controls['InvoceNumber'].setErrors({ invalid: false });
          this.openPurchaseConfirmation();
        } else {
          this.InvoiceForm.controls['InvoceNumber'].setErrors({ invalid: true });
          this.errMsg = res.data.error;
        }
      },
      (err: any) => {
        this.spinner.hide();
        if (err.error.status == 'error') {
          console.log('ERROR');
          this.alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // purchase confirmation popup
  openPurchaseConfirmation() {
    const modalRef = this._modalService.open(PurchaseConfimationComponent, { size: 'xl' });
    const data = {
      invoice: this.selectedInvoice,
    };
    console.log(this.InvoceNumber, 'invoice no');
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then(
      (data) => {
        // on close
        console.log(data);
        if (data === 'saveandsubmit') {
        }
      },
      (reason) => {
        // on dismiss
        console.log(reason);
      }
    );
  }
  // On key press testing the given input
  keyPressAlphaNumeric(event: any) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // to select the process type
  selectData(type: string) {
    this.selectedProcess = type;
    this.getInvoiceData();
  }
  // Get Invoice data

  getInvoiceData() {
    let processtype;
    this.selectedProcess === 'P' ? (processtype = 'process') : (processtype = 'unprocess');
    const payload = {
      type: processtype,
    };
    this.purchaseService.getInvoiceData(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.invoiceList = res.data;
          this.totalCount = this.invoiceList.length;
          if (this.selectedProcess === 'U') {
            if (this.invoiceList.length > 0) {
              this.enablePurchase = true;
            }
          } else {
            this.enablePurchase = false;
          }
        } else {
          this.totalCount = 0;
          this.invoiceList = [];
        }
      },
      (err: any) => {
        this.invoiceList = [];
        this.totalCount = 0;
      }
    );
  }
  // OnInvoice Selection
  onInvoiceSelection(event: any) {
    console.log(event);
    const indexval = this.selectedInvoice.indexOf(event.InvoiceNumber);
    if (indexval === -1) {
      this.selectedInvoice.push(event.InvoiceNumber);
    } else {
      this.selectedInvoice.splice(indexval, 1);
    }
  }
  // Check invoice
  submitUnproccessedData() {
    const payload = {
      InvoiceArray: this.selectedInvoice,
    };

    this.purchaseService.updateInvoice(payload).subscribe(
      (res: any) => {
        console.log(res, 'response');
        if (res.status === 200 || res.status === 'success') {
          this.openPurchaseConfirmation();
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
        if (err.error.status == 'error') {
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
  // routing respective pages
  onSalesClick() {
    if (this.selectedData === 'T') {
      // ,{ queryParams: { invoice: this.invoice } }
      this.router.navigate(['/sales']);
    } else {
      this.router.navigate(['/stock']);
    }
  }
  // on click checkbox
  onSelectCheckbox(eve: any) {
    console.log(eve);
    this.selectedInvoice = [];
    this.invoiceList.forEach((item: any) => {
      item.isSelected = eve;
      if (item.isSelected) {
        this.selectedInvoice.push(item.InvoiceNumber);
      }
    });
  }
  // called when page changes
  onpageChanges(eve: any) {}
}
