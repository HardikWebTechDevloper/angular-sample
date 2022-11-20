import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { OfficerDashboardService } from '@app/services/officer-dashboard.service';
import { AlertDashboard, licenseeCategory, licenseeList, resultList } from '@app/_models/dashboard';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {
  headerArray: Array<any>;
  alertCounts: AlertDashboard;
  listType: string;
  licenseeList: Array<licenseeList> = [];
  licenseeCategoryList: Array<licenseeCategory> = [];
  licenseeId = '';
  category = '';
  resultArray: Array<resultList> = [];
  page: number = 1;
  totalCount: number = 0;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  maxDate: any;
  model: NgbDateStruct;
  date: { year: number; month: number };
  currentDate: Date = new Date();
  currDate: any;
  constructor(
    private _dataService: DataService,
    private _dashBoardService: OfficerDashboardService,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 7);
    this.toDate = calendar.getPrev(calendar.getToday(), 'd', 1);
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    const d = new Date(),
      _24HoursInMilliseconds = 86400000;
    this.currDate = new Date(d.getTime() + -1 * _24HoursInMilliseconds);
    const todayDate = this.currentDate.getDate() - 1;
    const month = this.currentDate.getMonth() + 1;
    const year = this.currentDate.getFullYear();
    this.maxDate = { year: year, month: month, day: todayDate };
  }

  ngOnInit(): void {
    this.getCount();
    this.route.queryParams.subscribe((params) => {
      params.alerttype ? (this.listType = params.alerttype) : (this.listType = 'backlog');
      if (this.listType === 'backlog') {
        this.getRegisterBackLogs();
      } else {
        this.getPurchaseOrderList();
      }
      this._dataService.getHeaderOfficerData().subscribe((res: any) => {
        if (this.listType === 'backlog') {
          this.headerArray = res.notUpdatedStores;
        } else {
          this.headerArray = res.purchaseOrders;
        }
      });
    });

    this.getLicenseeList();
    this.getCategoryList();
  }
  // /To get count of Backlogs, purchase order
  getCount() {
    this._dashBoardService.getAlertCount().subscribe((res: any) => {
      console.log(res);
      if (res.status === 200 || res.status === 'success') {
        this.alertCounts = res.data;
        if (this.listType === 'backlog') {
          // this.totalCount =  this.alertCounts.totalRegisterBacklogs
        } else {
          this.totalCount = this.alertCounts.totalTransportPermits;
        }
      } else {
      }
    });
  }
  getList() {
    this.page = 1;
    if (this.listType === 'backlog') {
      this.getRegisterBackLogs();
    } else {
      this.getPurchaseOrderList();
    }
  }
  // Backlogs list
  getRegisterBackLogs() {
    const payload = {
      Page: this.page,
      // startDate: this.formatter.format(this.fromDate),
      // endDate: this.formatter.format(this.toDate),
      LicenseeID: this.licenseeId,
      LicenseType: this.category,
    };
    this._dashBoardService.getBackLogsList(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.resultArray = res.data.data;
          this.totalCount = res.data.totalRows;
        } else {
          this.resultArray = [];
          this.totalCount = 0;
        }
      },
      (err: any) => {}
    );
  }
  // Purchase Order list
  getPurchaseOrderList() {
    const payload = {
      Page: this.page,
      // startDate: this.formatter.format(this.fromDate),
      // endDate: this.formatter.format(this.toDate),
      LicenseeID: this.licenseeId,
      LicenseType: this.category,
    };
    console.log(payload);
    this._dashBoardService.getPurchaseOrderList(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.resultArray = res.data.data;
          this.totalCount = res.data.totalRows;
        } else {
          this.resultArray = [];
          this.totalCount = 0;
        }
      },
      (err: any) => {}
    );
  }
  // Licensee list
  getLicenseeList() {
    this._dashBoardService.getLicenseeList().subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.licenseeList = res.data;
        } else {
          this.licenseeList = [];
        }
      },
      (err: any) => {}
    );
  }

  // category list
  getCategoryList() {
    this._dashBoardService.getLicenseeCategoryList().subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.licenseeCategoryList = res.data;
        } else {
          this.licenseeCategoryList = [];
        }
      },
      (err: any) => {}
    );
  }
  onPageChanges(page: any) {
    console.log(page);
    if (page.action === 'next') {
      this.page = page.pageno + 1;
    } else {
      this.page = page.pageno - 1;
    }
    if (this.listType === 'backlog') {
      this.getRegisterBackLogs();
    } else {
      this.getPurchaseOrderList();
    }
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
