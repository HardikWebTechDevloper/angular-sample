import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { ExcisePuchaseService } from '@app/services/excise-puchase.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  invoiceDate: Date;
  disbaleCreateBtn: boolean = false;
  lastUpdateDate: Date;
  disableOpeningStock: boolean = false;
  displayText: string = 'Create';
  alertMessage: string = '';
  alertStatus: boolean = false;
  goLiveDate: Date;
  errMsg: string;
  routeAction: string;
  selectedData: string;
  constructor(
    private purchaseService: ExcisePuchaseService,
    private _dataService: DataService,
    private router: Router,
    private notifiService: NotificationPopupService,
    private _cookieService: CookieService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const licenseeData = this._cookieService.get('licenseeDetails');
    console.log(licenseeData);
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.goLiveDate = descyptedData?.GoLiveDate;
      this.selectedData = descyptedData?.DataEntry;
    }
    const golive_Date = new Date(this.goLiveDate);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    golive_Date.setHours(0, 0, 0, 0);
    console.log(todayDate);
    console.log(golive_Date);
    // console.log(todayDate <= golive_Date);
    // console.log(golive_Date <= todayDate)

    if (golive_Date <= todayDate) {
      this.disableOpeningStock = true;
      this.errMsg =
        'Your Go live date is ' +
        this.datePipe.transform(golive_Date, 'dd MMM yyyy') +
        ' please contact DEXP administration to change the Go live date';
    } else {
      this.checkLicensee();
    }
    this.purchaseService.getdigitalDetail().subscribe(
      (res: any) => {
        if (res.status === 'success' || res.status === 200) {
          this.invoiceDate = res.data[0].Date;
          this._cookieService.set('DexpDate', JSON.stringify(this.invoiceDate));
          this.routeAction = res.data[0].Status;
          this.displayText = 'Edit';
          const GivenDate = new Date(this.invoiceDate);
          const CurrentDate = new Date();
          CurrentDate.setHours(0, 0, 0, 0);
          GivenDate.setHours(0, 0, 0, 0);
          console.log(GivenDate > CurrentDate);
          if (GivenDate > CurrentDate) {
            this.disbaleCreateBtn = true;
          }
        } else {
          this.disbaleCreateBtn = true;
        }
      },
      (err: any) => {
        this.disbaleCreateBtn = true;
      }
    );

    this._dataService.getLastUpdatedDate().subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.lastUpdateDate = res.data[0].Date;
        } else {
        }
      },
      (err: any) => {}
    );
    this._dataService.getAlertMessage().subscribe(
      (res: any) => {
        console.log(res, 'res alert');
        if (res.status === 200 || res.status === 'success') {
          this.alertMessage = res.data;
          this.alertStatus = true;
        } else {
          this.alertStatus = false;
          this.alertMessage = 'Kindly Fill  Register Data';
          if (res?.data?.error) {
            this.alertMessage = res.data.error;
          }
        }
      },
      (err: any) => {
        // this.alertMessage = ''
      }
    );
  }
  // to check whether opening stock already entered
  checkLicensee() {
    this._dataService.checkLicenseeConfigured().subscribe(
      (res: any) => {
        console.log('res for disable btn----', res);
        if (res.status === 200 || res.status === 'success') {
          this._cookieService.set('disableOpeningStock', 'false');
        } else {
          this.disableOpeningStock = true;
          this.errMsg = 'Opening stock is already entered';
          this._cookieService.set('disableOpeningStock', 'true');
        }
      },
      (err: any) => {}
    );
  }
  // Based on the opening stock status routing
  checkStatus() {
    if (this.disableOpeningStock) {
      const alertObj = {
        title: '',
        text: this.errMsg,
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'OK',
      };
      this.notifiService.openAlert(alertObj);
    } else {
      this.router.navigate(['/opening-stock']);
    }
  }
  // To route purchase page based on the condition
  routeTo() {
    if (this.routeAction === 'F') {
      this.router.navigate(['/configuration']);
    } else {
      this.router.navigate(['/purchase']);
    }
  }
}
