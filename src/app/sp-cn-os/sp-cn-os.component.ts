import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { LicenseeService } from '@app/services/licensee.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sp-cn-os',
  templateUrl: './sp-cn-os.component.html',
  styleUrls: ['./sp-cn-os.component.scss'],
  providers: [DatePipe],
})
export class SpCnOsComponent implements OnInit {
  disableOpeningStock: boolean = false;
  activeUrl: string = '';
  goLiveDate: Date;
  errMsg: string;
  constructor(
    private _dataService: DataService,
    private router: Router,
    private _cookieService: CookieService,
    private datePipe: DatePipe,
    private _licenseeService: LicenseeService
  ) {}

  ngOnInit(): void {
    this.activeUrl = this.router.url;
    console.log(this.activeUrl);
  }
}
