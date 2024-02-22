import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
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
  allOperatorLeaves: any;
  operator: any;
  operatorAcceptedLeaves: any;
  operatorAcceptedVisaApplications: any;
  acceptedVisaApplications: any;

  dataSource!: any;
  operation: any;
  constructor(@Inject(MAT_DIALOG_DATA) public _operation: any, 
  private sharedService: SharedServiceService, private api: ApiService) {
    this.operator = this.sharedService.get('operator', 'session');

    const operatorOperations: any = this.api.getAuthorityOperations(this.operator.id, this.operator.profile.role);
    console.log(operatorOperations)

    this.operatorAcceptedLeaves = operatorOperations.allLeaves.filter((leave: any) => leave.status === 'accepted');
    this.operatorAcceptedVisaApplications = operatorOperations.allVisaApplications.filter((application: any) => application.status === 'accepted').reverse();

    switch (_operation._operation) {
      case 'domesticTravels':
        this.operation = 'Domestic Travels';
        this.dataSource = operatorOperations.allDomesticTravels;
        break;
      case 'internationalTravels':
        this.operation = 'International Travels';
        this.dataSource = operatorOperations.allInternationalTravels;
        break;
      case 'visaExtensionApplications':
        this.operation = 'Visa Extension Applications';
        this.dataSource = operatorOperations.allVisaExtensions;
        break;
      case 'guesthouseServices':
        this.operation = 'Guesthouse Services';
        this.dataSource = operatorOperations.allGuesthouseServices;
        break;
      case 'allFlightsInformation':
        this.operation = 'Flights Information';
        this.dataSource = operatorOperations.allFlightsInformation;
        break;
      case 'visaApplications':
        this.operation = 'Visa Applications';
        this.dataSource = operatorOperations.allVisaApplications;
        break;
      default:
        break;
    }
  }
}
