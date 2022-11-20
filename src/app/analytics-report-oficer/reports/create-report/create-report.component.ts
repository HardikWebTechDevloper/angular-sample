import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsReportService } from '@app/services/analytics-report.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbActiveModal, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss'],
})
export class CreateReportComponent implements OnInit {
  dateRange = 1;
  unitOfmeasure = 'litre';
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
  pdfURL: string = '';
  userDetails: any;
  ReportName: string = '';
  reportName: string = '';
  reportForm: FormGroup;
  submitted: boolean;
  model: NgbDateStruct;
  maxDate: any;
  currDate = new Date();
  constructor(
    private _reportService: AnalyticsReportService,
    private _sanitizer: DomSanitizer,
    private spinner: SpinnerService,
    private notifiService: NotificationPopupService,
    public activeModal: NgbActiveModal,
    private _cookieService: CookieService,
    private calendar: NgbCalendar
  ) {
    this.reportForm = new FormGroup({
      reportName: new FormControl(''),
    });
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
    this.userDetails = JSON.parse(this._cookieService.get('userDetails'));
    console.log(this.userDetails);
    const dateTime =
      d.getFullYear() +
      '_' +
      (d.getMonth() + 1) +
      '_' +
      d.getDate() +
      '_' +
      d.getHours() +
      '_' +
      d.getMinutes() +
      '_' +
      d.getSeconds();
    this.reportName = 'SalesReport_' + dateTime;
  }
  get reportFormControl() {
    return this.reportForm.controls;
  }
  close() {
    this.activeModal.close('success');
  }
  onDateSelect(date: any) {
    const selectedDate = this.model.year + '-' + this.model.month + '-' + this.model.day;
    this.currDate = new Date(selectedDate);
  }
  createReport() {
    this.spinner.show();
    const d = new Date();
    const year = d.getFullYear();
    const datRange = year + '-' + this.dateRange;
    const payload = {
      // Range: datRange,
      Range: this.currDate,
      unitOfMajor: this.unitOfmeasure,
      ReportName: this.reportName,
    };
    this._reportService.createOfficerReport(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          // this.pdfURL = res.data[0].pdf;
          const alertObj = {
            title: '',
            text: 'Report generated successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
          this.activeModal.close('success');
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
  returnURL(url: any) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
