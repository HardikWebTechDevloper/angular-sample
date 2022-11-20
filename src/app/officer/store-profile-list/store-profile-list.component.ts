import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { OfficerDashboardService } from '@app/services/officer-dashboard.service';
import { OfficerStoreprofileService } from '@app/services/officer-storeprofile.service';
import { licenseeCategory } from '@app/_models/dashboard';

@Component({
  selector: 'app-store-profile-list',
  templateUrl: './store-profile-list.component.html',
  styleUrls: ['./store-profile-list.component.scss'],
})
export class StoreProfileListComponent implements OnInit {
  resultArray: any = [];
  headerArray: any = [];
  page: number = 1;
  totalCount: number = 0;
  currDate = new Date();
  rangeList: any = [];
  range = '';
  category = '';
  licenseeCategoryList: Array<licenseeCategory> = [];
  constructor(
    private _storeProfileService: OfficerStoreprofileService,
    private _dashBoardService: OfficerDashboardService,
    private _dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const d = new Date(),
      _24HoursInMilliseconds = 86400000;

    this.currDate = new Date(d.getTime() + -1 * _24HoursInMilliseconds);

    this._dataService.getHeaderOfficerData().subscribe((res: any) => {
      this.headerArray = res.storeProfile;
    });
    this.getLicenseeRange();
    this.getCategoryList();
    this.getExciseRegisterList();
  }
  getExciseRegisterList() {
    const payload = {
      Page: this.page,
      Range: this.range,
      allData: 'no',
      licenseeType: this.category,
    };
    // console.log(payload);
    this._storeProfileService.getStorprofile(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.resultArray = res.data.data;
          this.totalCount = res.data.totalRows;
        } else {
          this.resultArray = [];
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
  onDropDownChanges() {
    this.page = 1;
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
  routeTo(data: any) {
    this.router.navigate(['/officer/store-profile'], { queryParams: { LID: data.LicenseeID } });
  }
  openMap(eve: any) {}
}
