import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { LicenseeService } from '@app/services/licensee.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';

@Component({
  selector: 'app-sp-tabs',
  templateUrl: './sp-tabs.component.html',
  styleUrls: ['./sp-tabs.component.scss'],
})
export class SpTabsComponent implements OnInit {
  @Input() disableOpeningStock: boolean = false;
  @Input() errMsg: string;
  activeUrl: string = '';
  goLiveDate: Date;
  constructor(
    private router: Router,
    private notifiService: NotificationPopupService,
    private datePipe: DatePipe,
    private _licenseeService: LicenseeService,
    private _dataService: DataService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;
      }
    });
  }

  ngOnInit(): void {}

  checkStatus() {
    // if (this.disableOpeningStock) {
    //   const alertObj = {
    //     title: '',
    //     text: this.errMsg,
    //     icon: 'info',
    //     showCancelButton: false,
    //     confirmButtonText: 'OK',
    //   };
    //   this.notifiService.openAlert(alertObj);
    // } else {
    //   this.router.navigate(['/opening-stock']);
    // }

    this._licenseeService.getLicenseeById().subscribe((res: any) => {
      console.log(res);
      if (res.status === 'success' || res.status === 200) {
        console.log(res.data);
        this.goLiveDate = res.data?.GoLiveDate;
        const GivenDate = new Date(this.goLiveDate);
        const CurrentDate = new Date();
        CurrentDate.setHours(0, 0, 0, 0);
        GivenDate.setHours(0, 0, 0, 0);
        if (GivenDate <= CurrentDate) {
          this.disableOpeningStock = true;
          this.errMsg =
            'Your Go live date is ' +
            this.datePipe.transform(GivenDate, 'dd MMM yyyy') +
            ' please contact DEXP administration to change the Go live date';

          const alertObj = {
            title: '',
            text: this.errMsg,
            icon: 'info',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        } else {
          this.checkLicensee();
        }
        console.log(this.disableOpeningStock);
      }
    });
  }
  checkLicensee() {
    this._dataService.checkLicenseeConfigured().subscribe(
      (res: any) => {
        console.log('res for disable btn----', res);
        if (res.status === 200 || res.status === 'success') {
          this.router.navigate(['/opening-stock']);
        } else {
          this.disableOpeningStock = true;
          this.errMsg = 'Opening stock is already entered';
          const alertObj = {
            title: '',
            text: this.errMsg,
            icon: 'info',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      },
      (err: any) => {}
    );
  }
}
