import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  pieData!: any;
  pieChartDatasets: any;

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      legend: {
        position: "top"
      }
    }
  };
  public pieChartLabels = ['Pending Leave Applications', 'Pending Visa Applications'];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private sharedService: SharedServiceService) {
    this.pieData = this.sharedService.getInitManagerPieData();
    console.log('start-pie',this.pieData)
    this.sharedService.watchManagerPieData().subscribe((pieData: any) => {
      this.pieChartDatasets = [{
        data: [pieData.pendingLeavesCount, pieData.pendingVisasCount]
      }];
    })
  }
  ngOnInit(): void {
    this.pieChartDatasets = [{
      data: [this.pieData.pendingLeavesCount, this.pieData.pendingVisasCount]
    }];
  }
}
