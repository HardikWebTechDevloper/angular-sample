import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsReportService } from '@app/services/analytics-report.service';
import { NotificationPopupService } from '@app/services/notification-popup.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss'],
})
export class CreateReportComponent implements OnInit {
  dateRange = 1;
  unitOfmeasure = 'litre';
  ReportName: string = '';
  reportName: string = '';
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
  reportForm: FormGroup;
  submitted: boolean;
  constructor(
    private _reportService: AnalyticsReportService,
    private _sanitizer: DomSanitizer,
    private spinner: SpinnerService,
    private notifiService: NotificationPopupService,
    public activeModal: NgbActiveModal,
    private cookieService: CookieService
  ) {
    this.reportForm = new FormGroup({
      reportName: new FormControl(''),
    });
  }

  ngOnInit(): void {
    const d = new Date();
    const month = d.getMonth();
    this.dateRange = month + 1;
    const licenseeData = this.cookieService.get('licenseeDetails');
    let licenseeId;
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      licenseeId = descyptedData.LicenseeID;
    }
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
    this.reportName = 'SalesReport_' + licenseeId + '_' + dateTime;
  }
  get reportFormControl() {
    return this.reportForm.controls;
  }
  close() {
    this.activeModal.close('success');
  }
  createReport() {
    this.spinner.show();
    const d = new Date();
    const year = d.getFullYear();
    const datRange = year + '-' + this.dateRange;
    const payload = {
      Range: datRange,
      ReportName: this.reportName,
      unitOfMajor: this.unitOfmeasure,
    };
    this._reportService.createReport(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          this.pdfURL = res.data[0].pdf;
          const alertObj = {
            title: '',
            text: 'Report generated successfully',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          };
          this.notifiService.openAlert(alertObj);
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
