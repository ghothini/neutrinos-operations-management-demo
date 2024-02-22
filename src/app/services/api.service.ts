import { Injectable } from '@angular/core';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  allVisaApplications: any;
  allVisaExtensions: any;
  allInternationalTravels: any;
  allGuesthouseServices: any;
  allDomesticTravels: any;
  allFlightsInformation: any;


  constructor(private sharedService: SharedServiceService) { }

  // Get all operations actions
  getOperations(): any {
    this.allVisaExtensions = this.sharedService.get('visaExtensionApplications', 'local');
    this.allGuesthouseServices = this.sharedService.get('guesthouseServices', 'local');
    this.allInternationalTravels = this.sharedService.get('internationalTravels', 'local');
    this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
    this.allDomesticTravels = this.sharedService.get('domesticTravels', 'local');
    this.allFlightsInformation = this.sharedService.get('allFlightsInformation', 'local');

    const operations = {
      "allVisaExtensions": this.allVisaExtensions,
      "allGuesthouseServices": this.allGuesthouseServices,
      "allInternationalTravels": this.allInternationalTravels,
      "allVisaApplications": this.allVisaApplications,
      "allDomesticTravels": this.allDomesticTravels,
      "allFlightsInformation": this.allFlightsInformation
    }
    return operations
  }

  // Get only user operations actions
  getAuthorityOperations(authorityId: any, role: any): any {
    const allLeaves = this.sharedService.get('allLeaves', 'local');
    const allOperations = this.getOperations();
    let authorityOperations;

    if(role.toLowerCase() === 'operator'){
       authorityOperations = {
        "allVisaExtensions": allOperations.allVisaExtensions.filter((visaApplication: any) => visaApplication.operator === authorityId),
        "allGuesthouseServices": allOperations.allGuesthouseServices.filter((visaExtension: any) => visaExtension.operator === authorityId),
        "allInternationalTravels": allOperations.allInternationalTravels.filter((internationalTravel: any) => internationalTravel.operator === authorityId),
        "allVisaApplications": allOperations.allVisaApplications.filter((guesthouseService: any) => guesthouseService.operator === authorityId),
        "allDomesticTravels": allOperations.allDomesticTravels.filter((domesticTravel: any) => domesticTravel.operator === authorityId),
        "allFlightsInformation": allOperations.allFlightsInformation.filter((flightInformation: any) => flightInformation.operator === authorityId),
        "allLeaves": allLeaves.filter((leave: any) => leave.operator === authorityId)
      }
    }
    if(role.toLowerCase() === 'employee'){
       authorityOperations = {
        "allVisaExtensions": allOperations.allVisaExtensions.filter((visaApplication: any) => visaApplication.id === authorityId),
        "allGuesthouseServices": allOperations.allGuesthouseServices.filter((visaExtension: any) => visaExtension.id === authorityId),
        "allInternationalTravels": allOperations.allInternationalTravels.filter((internationalTravel: any) => internationalTravel.id === authorityId),
        "allVisaApplications": allOperations.allVisaApplications.filter((guesthouseService: any) => guesthouseService.id === authorityId),
        "allDomesticTravels": allOperations.allDomesticTravels.filter((domesticTravel: any) => domesticTravel.id === authorityId),
        "allFlightsInformation": allOperations.allFlightsInformation.filter((flightInformation: any) => flightInformation.id === authorityId),
        "allLeaves": allLeaves.filter((leave: any) => leave.employeeId === authorityId)
      }
    }
    return authorityOperations;
  }
}
