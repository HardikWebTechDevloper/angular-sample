import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { ExcisePuchaseService } from '@app/services/excise-puchase.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-purchase-summary',
  templateUrl: './purchase-summary.component.html',
  styleUrls: ['./purchase-summary.component.scss'],
})
export class PurchaseSummaryComponent implements OnInit {
  fromParent: any;
  invoice: number;
  currentDate: Date;
  headerArray: any = [];
  purchaseSummaryList: any = [];
  totalCount: number = 0;
  selectedData: string;
  confirmPurchase: boolean = false;
  constructor(
    private _dataService: DataService,
    private purchaseService: ExcisePuchaseService,
    private router: Router,
    public activeModal: NgbActiveModal,
    private cookieService: CookieService,
    private notifiService: NotificationPopupService
  ) {}

  ngOnInit(): void {
    const licenseeData = this.cookieService.get('licenseeDetails');
    console.log(licenseeData);
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      console.log(descyptedData, 'descyptedData---');
      this.selectedData = descyptedData?.DataEntry;
    }
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.purchseSummary;
      console.log(this.headerArray);
    });
    this.invoice = this.fromParent.invoice;
    this.currentDate = this._dataService.getDexpDate();
    this.getSummaryDetails();
  }
  // To get Purchase summary details
  getSummaryDetails() {
    const payload = {
      InvoiceArray: this.invoice,
    };
    this.purchaseService.getPurchaseSummary(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.purchaseSummaryList = res.data;
          this.totalCount = this.purchaseSummaryList.length;
        } else {
          this.purchaseSummaryList = [];
        }
      },
      (err: any) => {
        this.purchaseSummaryList = [];
      }
    );
  }
  // Update the purchase details
  updatePurchase() {
    const payload = {
      InvoiceArray: this.invoice,
    };
    this.purchaseService.updatePuchaseSummary(payload).subscribe(
      (res: any) => {
        console.log(res, 'response');

        if (res.status === 200 || res.status === 'success') {
          this.activeModal.close('close');

          if (this.selectedData === 'T') {
            // ,{ queryParams: { invoice: this.invoice } }
            this.router.navigate(['/sales']);
          } else {
            this.router.navigate(['/stock']);
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
  // To close the current modal
  close() {
    this.activeModal.close('close');
  }
}
