import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ViewOperationComponent } from '../view-operation/view-operation.component';

@Component({
  selector: 'app-operator-landing',
  templateUrl: './operator-landing.component.html',
  styleUrls: ['./operator-landing.component.scss']
})
export class OperatorLandingComponent implements OnInit {
  chart: any;
  allLeaves: any;
  allOperatorLeaves: any;
  operator: any;
  allVisaApplications: any;
  allVisaExtensions: any;
  allInternationalTravels: any;
  allGuesthouseServices: any;
  allDomesticTravels: any;
  allFlightsInformation: any;
  allOperatorVisaApplications: any;
  allOperatorVisaExtensions: any;
  allOperatorInternationalTravels: any;
  allOperatorGuesthouseServices: any;
  allOperatorDomesticTravels: any;
  allOperatorFlightsInformation: any;
  operatorAcceptedLeaves: any;
  acceptedVisaApplications: any;

  constructor(private router: Router, private sharedService: SharedServiceService,
    private dialog: MatDialog) {
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.operator = this.sharedService.get('operator', 'session');
    this.allVisaExtensions = this.sharedService.get('visaExtensionApplications', 'local');
    this.allGuesthouseServices = this.sharedService.get('guesthouseServices', 'local');
    this.allInternationalTravels = this.sharedService.get('internationalTravels', 'local');
    this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
    this.allDomesticTravels = this.sharedService.get('domesticTravels', 'local');
    this.allFlightsInformation = this.sharedService.get('allFlightsInformation', 'local');

    // Only for operator
    this.allOperatorVisaApplications = this.allVisaApplications.filter((visaApplication: any) => visaApplication.operator === this.operator.id);
    this.allOperatorVisaExtensions = this.allVisaExtensions.filter((visaExtension: any) => visaExtension.operator === this.operator.id);
    this.allOperatorInternationalTravels = this.allInternationalTravels.filter((internationalTravel: any) => internationalTravel.operator === this.operator.id);
    this.allOperatorGuesthouseServices = this.allGuesthouseServices.filter((guesthouseService: any) => guesthouseService.operator === this.operator.id);
    this.allOperatorDomesticTravels = this.allDomesticTravels.filter((domesticTravel: any) => domesticTravel.operator === this.operator.id);
    this.allOperatorFlightsInformation = this.allFlightsInformation.filter((flightInformation: any) => flightInformation.operator === this.operator.id);
    this.allOperatorLeaves = this.allLeaves.filter((leave: any) => leave.operator === this.operator.id);
    this.operatorAcceptedLeaves = this.allOperatorLeaves.filter((leave: any) => leave.status === 'accepted');
  }

  ngOnInit(): void {
    const chartContainer = document.getElementById('pie-chart') as HTMLCanvasElement;
    this.chart = new Chart(chartContainer, {
      type: 'pie',
      data: {
        labels: ['Accepted Leaves', 'Accepted Visa Applications', 'Pending Visa Extensions',
          'Pending International Travels', 'Pending Guesthouse Services', 'Pending Domestic Travels',
          'Pending Flights Information'],
        datasets: [{
          backgroundColor: ['#a99494', '#3f51b5', '#5489b0', '#002948', '#37a586', '#7a7aa4', '#7f2222'],
          data: [this.operatorAcceptedLeaves.length, 23, this.allOperatorVisaExtensions.length,
          this.allOperatorInternationalTravels.length, this.allOperatorGuesthouseServices.length,
          this.allOperatorDomesticTravels.length, this.allOperatorFlightsInformation.length]
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  logOut(): void {
    this.router.navigate(['/sign-in']);
  }

  showOperation(operation: any): void {
    this.dialog.open(ViewOperationComponent, {
      data: {
        _operation: operation
      }
    });
  }
}
