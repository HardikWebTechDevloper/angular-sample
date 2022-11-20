import { Component, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service';
import { OpeningStockService } from '@app/services/opening-stock.service';
import { SpinnerService } from '@app/services/spinner.service';
import { reviewPopup, totalExcise } from '@app/_models/skuproduct';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-summary-popup',
  templateUrl: './summary-popup.component.html',
  styleUrls: ['./summary-popup.component.scss'],
})
export class SummaryPopupComponent implements OnInit {
  headerArray: any = [];
  public selectedData: string = 'sales';
  public selectedPreference: string = 'list';
  skuproductList: Array<any> = [
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '160',
    },
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '170',
    },
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '180',
    },
    {
      id: 1,
      skuCode: 'KSBCL SKU Code | ALIAS',
      alias: 'alias',
      sequence: '190',
    },
  ];
  totalExciseList: Array<totalExcise> = [];
  public fromParent: any;

  reviewCategory: Array<any>;
  selectedlicensee: any;
  RegisterType: any;
  constructor(
    private dataService: DataService,
    private _stockService: OpeningStockService,
    public activeModal: NgbActiveModal,
    private _cookieService: CookieService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    const licenseeData = this._cookieService.get('licenseeDetails');
    console.log(licenseeData);
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.RegisterType = descyptedData.RegisterType;
      this.selectedlicensee = descyptedData?.LicenseType;
    }
    // Based on Register type Header data will loaded
    this.dataService.getHeaderData().subscribe((res: any) => {
      // this.headerArray = res.openingStockSummaryHeader;
      if (this.RegisterType === 'Q') {
        this.headerArray = res.openingStockSummaryCl2Header;
      } else {
        this.headerArray = res.openingStockSummaryHeader;
      }
    });
    this.getTotalExcise();
    this.reviewCategory = this.fromParent.reviewCategory;
    console.log(this.fromParent.reviewCategory);
  }
  // To get total Excise
  getTotalExcise() {
    this.spinner.show();
    this._stockService.totalDigitalExcise().subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 'success') {
          this.totalExciseList = res.data;
          this.updateQTYML();
        } else {
          this.totalExciseList = [];
        }
      },
      (err: any) => {
        this.totalExciseList = [];
        this.spinner.hide();
      }
    );
  }
  // To update the total excise values
  updateQTYML() {
    this.totalExciseList.forEach((item) => {
      this.reviewCategory.forEach((element: any) => {
        if (element[item.SubCategory]) {
          // console.log(element[item.SubCategory])
          let totalQty = 0;
          let totalML = 0;
          element[item.SubCategory].forEach((category: any) => {
            totalQty = Number(totalQty) + Number(category.OpenStockQTY);
            totalML = Number(totalML) + Number(category.OpenStockML);
            console.log(totalQty);
          });

          if (totalQty !== 0 && item.sum_qty !== totalQty) {
            item.sum_qty = totalQty;
          }
          if (totalML !== 0 && item.sum_ml !== totalML) {
            item.sum_ml = totalML;
          }
        }
      });
    });
  }
  // To  Save the changes
  savecloseModal(closetype: string) {
    this.activeModal.close(closetype);
  }
}
