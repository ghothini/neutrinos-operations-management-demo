import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent {
  employee: any;
  employeeOperations: any;
  barChartDatasets: any;

  @Output() tableToShow = new EventEmitter<any>();

  constructor(private sharedService: SharedServiceService, private api: ApiService) {
    this.employee = this.sharedService.get('employee', 'session');
    this.employeeOperations = this.api.getAuthorityOperations(this.employee.id, this.employee.profile.role)
    
    this.barChartDatasets = [{
      data: [this.employeeOperations.allLeaves.length, this.employeeOperations.allVisaApplications.length,
        this.employeeOperations.allVisaExtensions.length, this.employeeOperations.allGuesthouseServices.length,
        this.employeeOperations.allInternationalTravels.length, this.employeeOperations.allDomesticTravels.length,
      this.employeeOperations.allFlightsInformation.length]
    }];
  }

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    },
    onClick: (e: any, activeEls: any) => {
      let datasetIndex = activeEls[0].index;
      let datasetLabel = e.chart.data.labels[datasetIndex];
      this.tableToShow.emit(datasetLabel);
    }
  };
  public barChartLabels = ['Leave Applications', 'Visa Applications', 'Visa Extensions', 'Guesthouse Services',
    'International Travels', 'Domestic Travels','Flights Information'];
  public barChartLegend = false;
  public barChartPlugins = [];
}
