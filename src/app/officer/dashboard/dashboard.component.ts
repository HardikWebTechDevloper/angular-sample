import { Component, OnInit } from '@angular/core';
import { OfficerDashboardService } from '@app/services/officer-dashboard.service';
import { AlertDashboard } from '@app/_models/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  alertCounts: AlertDashboard;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels = ['$101', '$1014'];
  public barChartLabels1 = ['Nandini'];

  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    { data: [6000, 4000, 80, 81, 56, 55, 6000], label: 'Total Target' },
    { data: [4000, 6000, 3000, 19, 86, 27, 90], label: 'Total Actual' },
  ];
  constructor(private _dashBoardService: OfficerDashboardService) {}
  ngOnInit(): void {
    this.getCount();
  }
  // /To get count of Backlogs, purchase order
  getCount() {
    this._dashBoardService.getAlertCount().subscribe((res: any) => {
      console.log(res);
      if (res.status === 200 || res.status === 'success') {
        this.alertCounts = res.data;
      } else {
      }
    });
  }
}
