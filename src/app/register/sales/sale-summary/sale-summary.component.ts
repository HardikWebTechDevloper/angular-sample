import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/services/alert.service';
import { DataService } from '@app/services/data.service';
import { ExciseSalesService } from '@app/services/excise-sales.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.scss'],
})
export class SaleSummaryComponent implements OnInit {
  headerArray: any = [];
  currentDate: Date = new Date();
  fromParent: any;
  summaryList: any = [];
  totalCount: number = 0;
  RegisterType: string;
  confirmPurchaseCount: boolean = false;
  confirmPurchase: boolean = false;
  constructor(
    private _dataService: DataService,
    private salesService: ExciseSalesService,
    public activeModal: NgbActiveModal,
    private _alertService: AlertService,
    private _cookieService: CookieService,
    private notifiService: NotificationPopupService
  ) {}

  ngOnInit(): void {
    const licenseeData = this._cookieService.get('licenseeDetails');
    this.currentDate = this._dataService.getDexpDate();
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.RegisterType = descyptedData?.RegisterType;
    }
    this._dataService.getHeaderData().subscribe((res: any) => {
      if (this.RegisterType === 'Q') {
        this.headerArray = res.saleSummary;
      } else {
        this.headerArray = res.saleMLSummary;
      }
    });
    this.getSummaryList();
  }
  // To get the sales summary list
  getSummaryList() {
    const payload = {
      // InvoiceNumber: this.fromParent.invoice,
    };
    console.log(payload, 'payload');
    this.salesService.getExciseDigitalSummary(payload).subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
          this.summaryList = res.data;
        } else {
          this.summaryList = [];
        }
      },
      (err: any) => {
        this.summaryList = [];
        if (err.error.status == 'error') {
          console.log('ERROR');
          this._alertService.error(err.error.error, { keepAfterRouteChange: true, autoClose: true });
        }
      }
    );
  }
  // Submit sales summary list
  submitSaleSummary() {
    const payload = {
      // invoiceNumber: this.fromParent.invoice,
    };
    this.salesService.submitSalesSummary(payload).subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
          this.activeModal.close('success');
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
        if (err.error.status == 'error') {
          console.log('ERROR--');
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
}
