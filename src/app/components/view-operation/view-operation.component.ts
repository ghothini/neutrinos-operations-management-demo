import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-view-operation',
  templateUrl: './view-operation.component.html',
  styleUrls: ['./view-operation.component.scss']
})
export class ViewOperationComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  visaExtensionsColumns: string[] = ['fullName','expireDate','renewalDate','passportNo','phoneNo']
  visaApplicationsColumns: string[] = ['fullName','expireDate','nationality','birthCountry','passportNo','status']
  internationalTravelColumns: string[] = ['indianPassport','travelDate','returnDate','visa','projectName','travelDays']
  guesthouseServicesColumns: string[] = ['fullName','email','problem','phoneNo','fixDate']
  flightInformationColumns: string[] = ['arrivalTime','airline','airport','ticketNo','phoneNo','email']
  domesticTravelColumns: string[] = ['fullName','travelDate','travelTime','returnDate','returnTime','projectName','managerEmail']
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
  operatorAcceptedVisaApplications: any;
  acceptedVisaApplications: any;

  dataSource!: any;
  operation: any;
  constructor(@Inject(MAT_DIALOG_DATA) public _operation: any, private sharedService: SharedServiceService) {
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.operator = this.sharedService.get('operator', 'session');
    this.allVisaExtensions = this.sharedService.get('visaExtensionApplications', 'local');
    this.allGuesthouseServices = this.sharedService.get('guesthouseServices', 'local');
    this.allInternationalTravels = this.sharedService.get('internationalTravels', 'local');
    this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
    this.allDomesticTravels = this.sharedService.get('domesticTravels', 'local');
    this.allFlightsInformation = this.sharedService.get('allFlightsInformation', 'local');
    console.log(this.allVisaApplications)

    // Only for operator
    this.allOperatorVisaApplications = this.allVisaApplications.filter((visaApplication: any) => visaApplication.operator === this.operator.id);
    this.allOperatorVisaExtensions = this.allVisaExtensions.filter((visaExtension: any) => visaExtension.operator === this.operator.id);
    this.allOperatorInternationalTravels = this.allInternationalTravels.filter((internationalTravel: any) => internationalTravel.operator === this.operator.id);
    this.allOperatorGuesthouseServices = this.allGuesthouseServices.filter((guesthouseService: any) => guesthouseService.operator === this.operator.id);
    this.allOperatorDomesticTravels = this.allDomesticTravels.filter((domesticTravel: any) => domesticTravel.operator === this.operator.id);
    this.allOperatorFlightsInformation = this.allFlightsInformation.filter((flightInformation: any) => flightInformation.operator === this.operator.id);
    this.allOperatorLeaves = this.allLeaves.filter((leave: any) => leave.operator === this.operator.id);
    this.operatorAcceptedLeaves = this.allOperatorLeaves.filter((leave: any) => leave.status === 'accepted');
    this.operatorAcceptedVisaApplications = this.allOperatorVisaApplications.filter((application: any) => application.status === 'accepted').reverse();

    switch (_operation._operation) {
      case 'domesticTravels':
        this.operation = 'Domestic Travels';
        this.dataSource = this.allDomesticTravels;
        break;
      case 'internationalTravels':
        this.operation = 'International Travels';
        this.dataSource = this.allInternationalTravels;
        break;
      case 'visaExtensionApplications':
        this.operation = 'Visa Extension Applications';
        this.dataSource = this.allVisaExtensions;
        break;
      case 'guesthouseServices':
        this.operation = 'Guesthouse Services';
        this.dataSource = this.allGuesthouseServices;
        break;
      case 'allFlightsInformation':
        this.operation = 'Flights Information';
        this.dataSource = this.allFlightsInformation;
        break;
      case 'visaApplications':
        this.operation = 'Visa Applications';
        this.dataSource = this.allVisaApplications;
        break;
      default:
        break;
    }
  }
}
