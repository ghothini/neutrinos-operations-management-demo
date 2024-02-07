import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-operator-landing',
  templateUrl: './operator-landing.component.html',
  styleUrls: ['./operator-landing.component.scss']
})
export class OperatorLandingComponent implements OnInit {
  chart: any;
  allLeaves: any;
  allVisaApplications: any;
  allVisaExtensions: any;
  allInternationalTravels: any;
  allGuesthouseServices: any;
  allDomesticTravels: any;
  allFlightsInformation: any;
  acceptedLeaves: any;
  acceptedVisaApplications: any;

  constructor(private router: Router, private sharedService: SharedServiceService){
    this.allLeaves = this.sharedService.get('allLeaves','local');
    this.allVisaExtensions = this.sharedService.get('visaExtensionApplications','local');
    this.allGuesthouseServices = this.sharedService.get('guesthouseServices','local');
    this.allInternationalTravels = this.sharedService.get('internationalTravels','local');
    this.allVisaApplications = this.sharedService.get('visaApplications','local');
    this.allDomesticTravels = this.sharedService.get('domesticTravels','local');
    this.allFlightsInformation = this.sharedService.get('allFlightsInformation','local');
    this.acceptedLeaves = this.allLeaves.filter((leave: any) => leave.status === 'accepted');
    console.log(this.acceptedLeaves)
  }

  ngOnInit(): void {
    const chartContainer = document.getElementById('pie-chart') as HTMLCanvasElement;
    this.chart = new Chart(chartContainer, {
      type: 'pie',
      data: {
        labels: ['Accepted Leaves','Accepted Visa Applications', 'Pending Visa Extensions',
        'Pending International Travels','Pending Guesthouse Services','Pending Domestic Travels',
        'Pending Flights Information'],
        datasets: [{
          backgroundColor: ['#a99494','#3f51b5','#5489b0','#002948','#37a586','#7a7aa4','#7f2222'],
          data: [this.acceptedLeaves.length,23,this.allVisaExtensions.length,
           this.allInternationalTravels.length,this.allGuesthouseServices.length,
           this.allDomesticTravels.length,this.allFlightsInformation.length]
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
}
