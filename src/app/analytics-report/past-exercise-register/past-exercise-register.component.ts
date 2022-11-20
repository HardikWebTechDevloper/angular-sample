import { Component, OnInit } from '@angular/core';
import { AnalyticsReportService } from '@app/services/analytics-report.service';
import { DataService } from '@app/services/data.service';
import { CookieService } from 'ngx-cookie-service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-past-exercise-register',
  templateUrl: './past-exercise-register.component.html',
  styleUrls: ['./past-exercise-register.component.scss'],
})
export class PastExerciseRegisterComponent implements OnInit {
  exciseType: string;
  exciseEntries = [
    {
      name: 'Previous day’s register',
      value: 'PreviousDay',
    },
    {
      name: 'Current Month’s Register',
      value: 'CurrentMonth',
    },
    {
      name: 'Current Quarter’s Register',
      value: 'CurrentQuarter',
    },
    {
      name: 'Half Yearly Register',
      value: 'HalfYearly',
    },
    {
      name: 'Yearly Register',
      value: 'Yearly',
    },
    {
      name: 'Previous year ',
      value: 'PreviousDay',
    },
    {
      name: 'Year',
      value: 'Year',
    },
  ];
  headerArray: any = [];
  headerArray1: any = [];

  pastExciseList: any = [];
  page: number = 1;
  totalCount: number = 0;
  showExcise: boolean = false;
  RegisterType: string = 'Q';
  AllPastExciseList: any[];
  newResArray: any = [];
  constructor(
    private _pastExciseService: AnalyticsReportService,
    private _dataService: DataService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    const licenseeData = this.cookieService.get('licenseeDetails');
    if (licenseeData) {
      const descyptedData = JSON.parse(licenseeData);
      this.RegisterType = descyptedData?.RegisterType;
    }
    this._dataService.getHeaderData().subscribe((res: any) => {
      this.headerArray = res.pastExcise;
      this.headerArray1 = res.salesRegisterHeader;
      if (this.RegisterType === 'Q') {
        this.headerArray1 = res.salesRegisterHeader;
      } else {
        this.headerArray1 = res.salesMLRegisterHeader;
      }
    });
  }

  getPastExcise() {
    const payload = {
      type: this.exciseType,
      Page: this.page,
    };
    this._pastExciseService.getPastExcise(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.pastExciseList = res.data.data;
          this.pastExciseList.forEach((element: any) => {
            element.PurchaseQTY = element.PurchaseQTY ? element.PurchaseQTY : 0;
            element.SalesQTY = element.SalesQTY ? element.SalesQTY : 0;
            element.SalesML = element.SalesML ? element.SalesML : 0;
            element.ClosingStockML = element.ClosingStockML ? element.ClosingStockML : 0;
            element.ClosingStockQTY = element.ClosingStockQTY ? element.ClosingStockQTY : 0;
            element.OpenStockML = element.OpenStockML ? element.OpenStockML : 0;
            element.OpenStockQTY = element.OpenStockQTY ? element.OpenStockQTY : 0;
          });
          this.totalCount = res.data.totalRows;
        } else {
          this.pastExciseList = [];
          this.totalCount = 0;
        }
        console.log(res);
      },
      (err: any) => {
        this.pastExciseList = [];
        this.totalCount = 0;
      }
    );
  }

  getAllPastExcise() {
    const payload = {
      type: this.exciseType,
      allData: 'yes',
    };
    this._pastExciseService.getPastExcise(payload).subscribe(
      (res: any) => {
        if (res.status === 200 || res.status === 'success') {
          this.AllPastExciseList = res.data.data;
          this.AllPastExciseList.forEach((element: any) => {
            element.PurchaseQTY = element.PurchaseQTY ? element.PurchaseQTY : 0;
            element.SalesQTY = element.SalesQTY ? element.SalesQTY : 0;
            element.SalesML = element.SalesML ? element.SalesML : 0;
            element.ClosingStockML = element.ClosingStockML ? element.ClosingStockML : 0;
            element.ClosingStockQTY = element.ClosingStockQTY ? element.ClosingStockQTY : 0;
            element.OpenStockML = element.OpenStockML ? element.OpenStockML : 0;
            element.OpenStockQTY = element.OpenStockQTY ? element.OpenStockQTY : 0;
          });
          this.createPdfData();
        } else {
          this.AllPastExciseList = [];
        }
        console.log(res);
      },
      (err: any) => {
        this.AllPastExciseList = [];
      }
    );
  }
  onItemSelect(item: any) {
    console.log(item);
    this.exciseType = item.value;
    this.getPastExcise();
    this.getAllPastExcise();
    this.showExcise = true;
  }
  onpageChanges(page: any) {
    if (page.action === 'next') {
      this.page = page.pageno + 1;
    } else {
      this.page = page.pageno - 1;
    }
    this.getPastExcise();
  }
  createPdfData() {
    let newArray: any = [];
    let headerArray = [];
    this.AllPastExciseList.forEach((element: any) => {
      let obj = {};
      this.headerArray1[1].subArr.forEach((elem: any) => {
        obj[elem['fieldName']] = element[elem['fieldName']];
      });
      newArray.push(obj);
    });
    this.newResArray = newArray;
  }
  saveAspdf() {
    const doc = new jsPDF();

    let columns;
    const data = [
      ['Data 1', 'Data 2', 'Data 3'],
      ['Data 1', 'Data 2', 'Data 3'],
    ];
    if (this.RegisterType === 'Qssss') {
      columns = [
        ['KSBCL SKU CODE', 'OPENING STOCK', 'PURCHASE', 'SALES', 'CLOSING STOCK'],
        ['', 'QTY', 'QTY', 'QTY', 'QTY'],
      ];
    } else {
      columns = [
        [
          { content: 'KSBCL SKU CODE' },
          {
            content: 'OPENING STOCK',
            colSpan: 2,
          },
          {
            content: 'PURCHASE',
            colSpan: 2,
          },
          {
            content: 'SALES',
            colSpan: 2,
          },
          {
            content: 'CLOSING STOCK',
            colSpan: 2,
          },
        ],
        ['', 'QTY', 'ML', 'QTY', 'ML', 'QTY', 'ML', 'QTY', 'ML'],
      ];
    }
    var outputData = this.newResArray.map(Object.values);

    // console.log(outputData,"test----kkkk")
    autoTable(doc, {
      head: columns,
      body: outputData,
      didDrawPage: (dataArg) => {
        doc.text('Past Excise Register', dataArg.settings.margin.left, 10);
      },
    });
    const d = new Date();
    const n = d.getTime();
    doc.save('PastExciseReport' + n);
  }
}
