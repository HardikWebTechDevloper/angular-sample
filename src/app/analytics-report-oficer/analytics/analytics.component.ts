import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@app/services/analytics.service';
import { SpinnerService } from '@app/services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  selectedData: string = 'month';
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          // gridLines: {
          //     display:false,
          //     drawOnChartArea: false
          // }
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            drawOnChartArea: false,
          },
          stacked: true,
          min: 0,
          max: 5000,
          ticks: {
            // forces step size to be 50 units
            stepSize: 500,
          },
        },
      ],
    },
  };
  public barChartOptionpurchase = {
    // scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          // gridLines: {
          //     display:false,
          //     drawOnChartArea: false
          // }
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            drawOnChartArea: false,
          },
          min: 0,
          max: 5000,
          ticks: {
            // forces step size to be 50 units
            stepSize: 500,
          },
        },
      ],
    },
  };
  public barChartLabels = ['$101', '$1014'];
  public barChartLabels1 = ['Nandini'];

  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [
    { data: [6000, 4000, 80, 81, 56, 55, 6000], label: 'Total Target' },
    { data: [4000, 6000, 3000, 19, 86, 27, 90], label: 'Total Actual' },
  ];

  // pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];

  public pieChartLabels1: Label[] = [];
  public pieChartData1: number[] = [];
  // stock on hand
  public stockOnHandCategoryLabel: Label[] = [];
  public stockOnHandCategoryData: number[] = [];

  public stockOnHandSubCategoryLabel: Label[] = [];
  public stockOnHandSubCategoryData: number[] = [];
  // purchase
  public purchaseSubCategoryLabel: Label[] = [];
  public purchaseSubCategoryData: any[] = [];

  public purchaseCategoryLabel: Label[] = [];
  public purchaseCategoryData: any[] = [];
  // sales
  public salesSubCategoryLabel: Label[] = [];
  public salesSubCategoryData: any[] = [];

  public salesCategoryLabel: Label[] = [];
  public salesCategoryData: any[] = [];

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgb(69,139,219)', 'rgb(91,201,178)'],
    },
  ];
  public pieChartColors1 = [
    {
      backgroundColor: [
        'rgb(69,139,219)',
        'rgb(91,201,178)',
        'rgb(215,90,112)',
        'rgb(234,140,66)',
        'rgb(244,188,73)',
        'rgb(139,116,198)',
        'rgb(85,192,220)',
        'rgb(163,214,76)',
      ],
    },
  ];
  constructor(
    private _modalService: NgbModal,
    private _analyticsService: AnalyticsService,
    private spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    this.getAnalyticsData();
  }
  selectData(type: string) {
    this.selectedData = type;
    this.getAnalyticsData();
  }
  getAnalyticsData() {
    const payload = {
      type: this.selectedData,
    };
    this.spinner.show();

    this._analyticsService.getAnalyticOfficerData(payload).subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log(res, 'res--------');

        if (res.status === 200 || res.status === 'success') {
          this.stockOnHandCategoryLabel = [];
          this.stockOnHandCategoryData = [];

          this.stockOnHandSubCategoryLabel = [];
          this.stockOnHandSubCategoryData = [];
          // purchase
          this.purchaseSubCategoryLabel = [];
          this.purchaseSubCategoryData = [];

          this.purchaseCategoryLabel = [];
          this.purchaseCategoryData = [];
          // sales
          this.salesSubCategoryLabel = [];
          this.salesSubCategoryData = [];

          this.salesCategoryLabel = [];
          this.salesCategoryData = [];
          // Stock on hand

          const stockOnHandMajorCategory = res.data.stockOnHandMajorCategory;
          stockOnHandMajorCategory.forEach((element: any) => {
            this.stockOnHandCategoryLabel.push(element.MajorCategory);
            this.stockOnHandCategoryData.push(element.total_OpeningStockQty);
          });

          const stockOnHandSubCategory = res.data.stockOnHandSubCategory;
          stockOnHandSubCategory.forEach((element: any) => {
            this.stockOnHandSubCategoryLabel.push(element.ReportingCategory);
            this.stockOnHandSubCategoryData.push(element.total_OpeningStockQty);

            console.log(element.total_PurchaseQty);
            this.purchaseSubCategoryLabel.push(element.ReportingCategory);
            if (this.purchaseSubCategoryData.length === 0) {
              this.purchaseSubCategoryData.push({ data: [element.total_PurchaseQty] });
            } else {
              this.purchaseSubCategoryData[0].data.push(element.total_PurchaseQty);
            }
            this.salesSubCategoryLabel.push(element.ReportingCategory);
            if (this.salesSubCategoryData.length === 0) {
              this.salesSubCategoryData.push({
                data: [element.total_SaleQty],
                // label:element.ReportingCategory
              });
            } else {
              this.salesSubCategoryData[0].data.push(element.total_SaleQty);
            }
          });

          if (this.selectedData === 'month') {
            // purchase sales category month

            const purchaseCategorymonth = res.data.salePurchasemonth;
            purchaseCategorymonth.forEach((element: any) => {
              this.purchaseCategoryLabel.push(element.MajorCategory);

              if (this.purchaseCategoryData.length === 0) {
                this.purchaseCategoryData.push({
                  data: [element.total_PurchaseQty],
                });
              } else {
                this.purchaseCategoryData[0].data.push(element.total_PurchaseQty);
              }
              this.salesCategoryLabel.push(element.MajorCategory);
              if (this.salesCategoryData.length === 0) {
                this.salesCategoryData.push({
                  data: [element.total_SaleQty],
                });
              } else {
                this.salesCategoryData[0].data.push(element.total_SaleQty);
              }
              // this.salesCategoryData[0].label = this.salesCategoryLabel
            });
          } else {
            // purchase sales category year

            const purchaseCategoryyear = res.data.salePurchaseyear;
            purchaseCategoryyear.forEach((element: any) => {
              this.purchaseCategoryLabel.push(element.MajorCategory);
              if (this.purchaseCategoryData.length === 0) {
                this.purchaseCategoryData.push({
                  data: [element.total_PurchaseQty],
                });
              } else {
                this.purchaseCategoryData[0].data.push(element.total_PurchaseQty);
              }
              // this.purchaseCategoryData[0].label = this.purchaseCategoryLabel
              console.log(this.purchaseCategoryData);
              this.salesCategoryLabel.push(element.MajorCategory);
              if (this.salesCategoryData.length === 0) {
                this.salesCategoryData.push({
                  data: [element.total_SaleQty],
                });
              } else {
                this.salesCategoryData[0].data.push(element.total_SaleQty);
              }
              // this.salesCategoryData[0].label =  this.salesCategoryLabel

              // if (this.purchaseCategoryLabel.indexOf(element.MCategory) === -1) {
              //   this.purchaseCategoryLabel.push(element.MCategory);
              // }
              // const indexval = this.purchaseCategoryData.findIndex((item: any) => item.label === element.year);
              // console.log(indexval, 'kkkkkkkkkk');
              // if (indexval === -1) {
              //   this.purchaseCategoryData.push({
              //     data: [element.total_PurchaseQty],
              //     label: element.year,
              //   });
              // } else {
              //   this.purchaseCategoryData[indexval].data.push(element.total_PurchaseQty);
              // }
              // // this.purchaseCategoryData =  [
              // //   {data: [65, 59, 80, 60, 50], label: '2020'},
              // //   {data: [28, 48, 40, 81], label: '2021'}
              // // ];
              // console.log(this.purchaseCategoryData);
              // if (this.salesCategoryLabel.indexOf(element.MCategory) === -1) {
              //   this.salesCategoryLabel.push(element.MCategory);
              // }
              // const indexvalsale = this.salesCategoryData.findIndex((item: any) => item.label === element.year);
              // if (indexvalsale === -1) {
              //   this.salesCategoryData.push({
              //     data: [element.total_SaleQty],
              //     label: element.year,
              //   });
              // } else {
              //   this.salesCategoryData[indexvalsale].data.push(element.total_SaleQty);
              // }
            });
          }
        } else {
        }
      },
      (err: any) => {
        this.spinner.hide();
      }
    );
  }
}
