import { Component, OnInit } from '@angular/core';
import { AnalyticsReportService } from '@app/services/analytics-report.service';
import { DataService } from '@app/services/data.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { OfficerDashboardService } from '@app/services/officer-dashboard.service';
import { OfficerStoreprofileService } from '@app/services/officer-storeprofile.service';
import { SpinnerService } from '@app/services/spinner.service';
import { licenseeCategory } from '@app/_models/dashboard';
import { NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateReportComponent } from './create-report/create-report.component';
// import { saveAs } from 'file-saver';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  reportsList: any = [];
  totalCount: number = 0;
  forwardedReport: any = [];
  myReport: any = [];

  headerArray: any = [];
  reportType = 'Monthly';
  ReportSource: string = 'F';
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
  licenseeList: any;
  licenseeId: string = '';
  category: string = '';
  model: NgbDateStruct;
  maxDate: any;
  currDate = new Date();
  licenseeCategoryList: Array<licenseeCategory> = [];
  constructor(
    private _modalService: NgbModal,
    private _reportService: AnalyticsReportService,
    private _dataService: DataService,
    private spinner: SpinnerService,
    private _officerLicenseeService: OfficerStoreprofileService,
    private _dashBoardService: OfficerDashboardService,
    private calendar: NgbCalendar,
    private notifiService: NotificationPopupService
  ) {
    this.model = calendar.getPrev(calendar.getToday(), 'd', 1);
    const currentDate = new Date();
    const todayDate = currentDate.getDate() - 1;
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    this.maxDate = { year: year, month: month, day: todayDate };
  }

  ngOnInit(): void {
    const d = new Date(),
      _24HoursInMilliseconds = 86400000;
    const month = d.getMonth();
    this.dateRange = month + 1;
    this.currDate = new Date(d.getTime() + -1 * _24HoursInMilliseconds);
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.forwardedReport = res.reportsOfficerHeader;
      this.myReport = res.myReportsOfficerHeader;
      this.headerArray = res.reportsOfficerHeader;
    });
    this.getLicenseeReports();
    this.getLicenseeList();
    this.getCategoryList();
  }
  onDateSelect(date: any) {
    this.page = 1;
    const selectedDate = this.model.year + '-' + this.model.month + '-' + this.model.day;
    this.currDate = new Date(selectedDate);
    this.onValueChange();
  }
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
  changeReportType(type: string) {
    this.ReportSource = type;
    if (this.ReportSource === 'F') {
      this.headerArray = this.forwardedReport;
    } else {
      this.licenseeId = '';
      this.category = '';
      this.headerArray = this.myReport;
    }
    this.getLicenseeReports();
  }
  getLicenseeReports() {
    this.spinner.show();
    const d = new Date();
    const year = d.getFullYear();
    const datRange = year + '-' + this.dateRange;
    const payload = {
      Page: this.page,
      Range: datRange,
      reportType: this.reportType,
      ReportSource: this.ReportSource,
      LicenseeID: this.licenseeId,
      licenseeType: this.category,
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
  getLicenseeList() {
    const payload = {
      allData: 'yes',
    };
    console.log(payload);
    this._officerLicenseeService.getStorprofile(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.licenseeList = res.data.data;
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
  downloadFn(data: any) {
    console.log(data);
    const payload = {
      // Id:data.Id
      Id: 199,
    };
    console.log(payload);
    this._reportService.downloadPDF(payload).subscribe((res: any) => {
      var file = new Blob([res], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);

      // if you want to open PDF in new tab
      window.open(fileURL);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'bill.pdf';
      document.body.appendChild(a);
      a.click();
      console.log(res, 'hhhhhh');
      // var blob = new Blob([res.data], {type: "application/pdf"});
      // if (res.status === 200 || res.status === 'success') {
      //   // saveAs(res.data.ReportPath)
      // } else {

      // }
      // fileSaver.saveAs(blob)
    });
  }
  download(data: any) {
    //this.fileService.downloadFile().subscribe(response => {
    this._reportService.downloadFile(data.ReportPath).subscribe((response: any) => {
      //when you use stricter type checking
      let blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      //window.open(url);
      //window.location.href = response.url;
      fileSaver.saveAs(blob, 'employees.json');
      //}), error => console.log('Error downloading the file'),
    }),
      (error: any) => console.log('Error downloading the file'), //when you use stricter type checking
      () => console.info('File downloaded successfully');
  }
  onPerformAction(event: any) {
    switch (event.action) {
      case 'download':
        this.downloadFn(event.tableData);
        // this.download(event.tableData)
        break;

      case 'forward':
        this.forwardReport(event.tableData);
        break;
    }
  }
}
