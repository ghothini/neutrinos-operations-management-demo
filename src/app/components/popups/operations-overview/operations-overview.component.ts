import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { GraphComponent } from '../../charts/graph/graph.component';

@Component({
  selector: 'app-operations-overview',
  templateUrl: './operations-overview.component.html',
  styleUrls: ['./operations-overview.component.scss']
})
export class OperationsOverviewComponent {

  visaExtensionsColumns: string[] = ['fullName', 'expireDate', 'renewalDate', 'passportNo', 'phoneNo', 'status']
  visaApplicationsColumns: string[] = ['fullName', 'expireDate', 'nationality', 'birthCountry', 'passportNo', 'status']
  internationalTravelColumns: string[] = ['indianPassport', 'travelDate', 'returnDate', 'visa', 'projectName', 'travelDays','status']
  guesthouseServicesColumns: string[] = ['fullName', 'problem', 'phoneNo', 'addressProblemDate', 'additionalInfo', 'status']
  flightInformationColumns: string[] = ['arrivalTime', 'airline', 'airport', 'ticketNo', 'phoneNo', 'email','status']
  domesticTravelColumns: string[] = ['fullName', 'travelDate', 'travelTime', 'returnDate', 'returnTime', 'projectName', 'customerName','status']
  leavesColumns: string[] = ['leaveId', 'leaveType', 'leaveStartDate', 'leaveEndDate', 'status'];
  operation: any;
  dataSource!: any;
  employee: any;
  tableErrorMsg: any;
  employeeOperations: any;
  constructor(@Inject(MAT_DIALOG_DATA) public _operation: any, private api: ApiService,
    private sharedService: SharedServiceService) {
    this.operation = _operation._operation;

    this.employee = this.sharedService.get('employee', 'session');
    this.employeeOperations = this.api.getAuthorityOperations(this.employee.id, this.employee.profile.role)
    this.tableToShow(_operation._operation)
  }

  showTable(operationTitle: any) {
    switch (operationTitle) {
      case 'domesticTravels':
        this.operation = 'Domestic Travels';
        this.tableErrorMsg = 'No domestic travels applied';
        this.dataSource = this.employeeOperations.allDomesticTravels;
        break;
      case 'internationalTravels':
        this.operation = 'International Travels';
        this.tableErrorMsg = 'No international travels applied';
        this.dataSource = this.employeeOperations.allInternationalTravels;
        break;
      case 'visaExtensionApplications':
        this.operation = 'Visa Extension Applications';
        this.tableErrorMsg = 'No visa extension applied';
        this.dataSource = this.employeeOperations.allVisaExtensions;
        break;
      case 'guesthouseServices':
        this.operation = 'Guesthouse Services';
        this.tableErrorMsg = 'No guesthouse services applied';
        this.dataSource = this.employeeOperations.allGuesthouseServices;
        break;
      case 'allFlightsInformation':
        this.operation = 'Flights Information';
        this.tableErrorMsg = 'No flight information applied';
        this.dataSource = this.employeeOperations.allFlightsInformation;
        break;
      case 'visaApplications':
        this.operation = 'Visa Applications';
        this.tableErrorMsg = 'No visa application applied';
        this.dataSource = this.employeeOperations.allVisaApplications;
        break;
      case 'allLeaves':
        this.operation = 'Leave Applications';
        this.tableErrorMsg = 'No leave applications applied';
        this.dataSource = this.employeeOperations.allLeaves;
        break;
      default:
        break;
    }
  }

  tableToShow(tableTitle: any) {
    switch (tableTitle) {
      case 'Domestic Travels':
        this.showTable('domesticTravels')
        break;
      case 'International Travels':
        this.showTable('internationalTravels')
        break;
      case 'Visa Extensions':
        this.showTable('visaExtensionApplications')
        break;
      case 'Guesthouse Services':
        this.showTable('guesthouseServices')
        break;
      case 'Flights Information':
        this.showTable('allFlightsInformation')
        break;
      case 'Visa Applications':
        this.showTable('visaApplications')
        break;
      case 'Leave Applications':
        this.showTable('allLeaves')
        break;
      default:
        break;
    }
  }
}
