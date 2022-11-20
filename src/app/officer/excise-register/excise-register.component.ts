import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service';
import { OfficerDashboardService } from '@app/services/officer-dashboard.service';
import { OfficerStoreprofileService } from '@app/services/officer-storeprofile.service';
import { SpinnerService } from '@app/services/spinner.service';
import { licenseeCategory } from '@app/_models/dashboard';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-excise-register',
  templateUrl: './excise-register.component.html',
  styleUrls: ['./excise-register.component.scss'],
})
export class ExciseRegisterComponent implements OnInit {
  resultArray: any = [];
  headerArray: any = [];
  page: number = 1;
  totalCount: number = 0;
  currDate = new Date();
  rangeList: any = [];
  range = '';
  category = '';
  licenseeId = '';
  licenseeCategoryList: Array<licenseeCategory> = [];
  licenseeList: any = [];
  onLoad: boolean = false;
  model: NgbDateStruct;
  maxDate: any;
  constructor(
    private _storeProfileService: OfficerStoreprofileService,
    private _dashBoardService: OfficerDashboardService,
    private _dataService: DataService,
    private calendar: NgbCalendar,
    private spinner: SpinnerService
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
    this.currDate = new Date(d.getTime() + -1 * _24HoursInMilliseconds);
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.salesRegisterHeader;
    });
    console.log(this.headerArray);
    this.getLicenseeRange();
    this.getCategoryList();
    this.getLicenseeList();
    this.getExciseRegisterList();
  }
  onDateSelect(date: any) {
    this.page = 1;
    const selectedDate = this.model.year + '-' + this.model.month + '-' + this.model.day;
    this.currDate = new Date(selectedDate);
    this.getExciseRegisterList();
  }
  getExciseRegisterList() {
    const payload = {
      Page: this.page,
      Range: this.range,
      licenseeType: this.category,
      LicenseeID: this.licenseeId,
      allData: 'no',
      Date: this.currDate,
    };
    console.log(payload);
    this.onLoad = false;
    this.spinner.show();
    this._storeProfileService.getLicenseeExcise(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.onLoad = true;
        // console.log(res,"res===========")
        if (res.status === 200 || res.status === 'success') {
          this.resultArray = res.data.data;
          this.totalCount = res.data.totalRows;
          // console.log(this.resultArray, 'kkkk');
          // this.totalCount = res.data.totalRows;
        } else {
          this.resultArray = [];
          this.totalCount = 0;
        }
      },
      (err: any) => {
        this.spinner.hide();
        this.onLoad = false;
        this.resultArray = [];
        this.totalCount = 0;
      }
    );
  }
  getLicenseeList() {
    const payload = {
      Page: this.page,
      Range: this.range,
      licenseeType: this.category,
      allData: 'yes',
    };
    console.log(payload);
    this._storeProfileService.getStorprofile(payload).subscribe(
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
  getLicenseeRange() {
    this._storeProfileService.getLicenseeRange().subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.rangeList = res.data;
        } else {
          this.rangeList = [];
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
    this.getExciseRegisterList();
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

  onDataChange() {
    this.page = 1;
    this.getExciseRegisterList();
  }
  onLicenseeChange(licenseeId: any) {
    if (licenseeId == '') {
      this.page = 1;
      this.getExciseRegisterList();
    } else {
      const filteredArray = this.licenseeList.filter((item: any) => item.LicenseeID == licenseeId);
      const RegisterType = filteredArray[0].RegisterType;
      this.onLoad = false;
      this._dataService.getHeaderData().subscribe((res: any) => {
        if (RegisterType === 'Q') {
          this.headerArray = res.salesRegisterHeader;
        } else {
          this.headerArray = res.salesMLRegisterHeader;
        }
        this.page = 1;
        this.getExciseRegisterList();
        console.log(this.headerArray);
      });
    }

    // this.getExciseRegisterList()
  }
}
