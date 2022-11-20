import { Component, OnInit } from '@angular/core';
import { AnalyticsReportService } from '@app/services/analytics-report.service';
import { DataService } from '@app/services/data.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateReportComponent } from './create-report/create-report.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportsList: any = [];
  totalCount: number = 0;
  headerArray: any = [];
  reportType = 'Monthly';
  dateRange = 1;
  monthArr = [
    { id: 1, display: 'Jan' },
    { id: 2, display: 'Feb' },
    { id: 3, display: 'Mar' },
    { id: 4, display: 'Apr' },
    { id: 5, display: 'May' },
    { id: 6, display: 'Jun' },
    { id: 7, display: 'July' },
    { id: 8, display: 'Aug' },
    { id: 9, display: 'Sep' },
    { id: 10, display: 'Oct' },
    { id: 11, display: 'Nov' },
    { id: 12, display: 'Dec' },
  ];
  page: number = 1;
  constructor(
    private _modalService: NgbModal,
    private _reportService: AnalyticsReportService,
    private _dataService: DataService,
    private spinner: SpinnerService,
    private notifiService: NotificationPopupService
  ) {}

  ngOnInit(): void {
    const d = new Date();
    const month = d.getMonth();
    this.dateRange = month + 1;
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.reportsHeader;
    });
    this.getLicenseeReports();
  }
  // to open create Popup
  openReportPopup() {
    const modalRef = this._modalService.open(CreateReportComponent, { size: 'lg', windowClass: 'reports-modal' });
    modalRef.result.then(
      (data) => {
        // on close
        this.getLicenseeReports();
      },
      (reason) => {
        // on dismiss
        this.getLicenseeReports();
      }
    );
  }
  // To get Reports
  getLicenseeReports() {
    this.spinner.show();
    const d = new Date();
    const year = d.getFullYear();
    const datRange = year + '-' + this.dateRange;
    const payload = {
      Range: datRange,
      reportType: this.reportType,
      Page: this.page,
    };
    console.log(payload);
    this._reportService.getLicenseeReports(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 'success' || res.status === 200) {
          this.reportsList = res.data.data;
          this.totalCount = res.data.totalRows;
        } else {
          this.reportsList = [];
          this.totalCount = 0;
        }
      },
      (err: any) => {
        this.spinner.hide();
        this.reportsList = [];
        this.totalCount = 0;
      }
    );
  }
  onItemSelect(event: any) {}
  OnSelectAll() {}
  onPageChanges(page: any) {
    if (page.action === 'next') {
      this.page = page.pageno + 1;
    } else {
      this.page = page.pageno - 1;
    }
    this.getLicenseeReports();
  }
  onValueChange() {
    this.page = 1;
    this.getLicenseeReports();
  }
  sendMail(data: any) {
    console.log(data.tableData);
    const payload = {
      Id: data.tableData.Id,
    };
    console.log(payload);
    this.spinner.show();
    this._reportService.forwardMailToOficer(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          const alertObj = {
            title: '',
            text: res.data,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        } else {
          const alertObj = {
            title: '',
            text: res.data.error,
            icon: 'success',
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
        }
      }
    );
  }
  onPerformAction(data: any) {
    console.log(data.action, 'kkkkkkkkk');
    switch (data.action) {
      case 'mail':
        this.sendMail(data);
        break;
      case 'forward':
        this.forwardReport(data.tableData);
        break;
    }
  }
  // forward report
  forwardReport(data: any) {
    const payload = {
      Id: data.Id,
    };
    this.spinner.show();
    this._reportService.forwardReport(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          const alertObj = {
            title: '',
            text: 'Report forwarded',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        } else {
          const alertObj = {
            title: '',
            text: res.data.error,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
        }
      },
      (err) => {
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
        }
      }
    );
  }
}
