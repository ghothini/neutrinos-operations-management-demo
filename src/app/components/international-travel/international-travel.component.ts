import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-international-travel',
  templateUrl: './international-travel.component.html',
  styleUrls: ['./international-travel.component.scss']
})
export class InternationalTravelComponent {
  employee: any;
  allEmployees: any;
  allInternationalTravels: any;
  internationalTravelData: any = {
    indianPassport: '',
    dateOfIssue: '',
    dateOfRequest: '',
    confirmedTravelDate: '',
    prefferedTravelTime: '',
    confirmedReturnDate: '',
    prefferedReturnTime: '',
    whatsappNo: '',
    customerName: '',
    projectName: '',
    firstTimeTravel: '',
    visaValidity: '',
    designation: '',
    department: '',
    sector: '',
    currensy: ''
  }
  employeeCredentialsFormData: any = {
    surname: 'Mokotelakoena',
    name: 'Thapelo',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    managerName: 'Goitsemang',
    managerEmail: 'goitse@neutrinos.com',
    renewalDate: '',
  }
  currensies: string[] = ['1 ZAR (South African Rand)','1 INR/ 0.22484 ZAR (Indian Rupee/South African Rand)'];
  visaValidities: string[] = ['Valid','Invalid'];

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
      this.employee = this.sharedService.get('employee','session');
      this.allEmployees = this.sharedService.get('employees','local');
      this.allInternationalTravels = this.sharedService.get('internationalTravels','local');
      console.log(this.allInternationalTravels)
     }
  goBack(): void {
    this.location.back();
    this.sharedService.updateOperationsShow();
  }

  submit(): void {
    const internationalTravel = {
      ...this.internationalTravelData,
      credentials: {
        ...this.employeeCredentialsFormData
      }
    }

    this.employee.operationsOperated.internationalTravels.push(internationalTravel);
    // Update session and local storage and visa extensions array
    this.sharedService.set('employee','session',this.employee);
    this.allEmployees.forEach((employee: any) => {
      if(employee.id === this.employee.id){
        employee.operationsOperated.internationalTravels.push(internationalTravel);
        this.sharedService.set('employees','local',this.allEmployees);
      }
    })
    this.allInternationalTravels.push(internationalTravel);
    this.allInternationalTravels[this.allInternationalTravels.length - 1] = {
      ...this.allInternationalTravels[this.allInternationalTravels.length - 1],
      id: this.employee.id
    }
    console.log(this.allInternationalTravels);
    this.sharedService.set('internationalTravels','local',this.allInternationalTravels);
    this.snackbar.open(`International travel was requested successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }

  // updateFullAmt(): void {
  //   if(this.internationalTravelData.travelDays)
  //   this.internationalTravelData.fullAmt = this.internationalTravelData.travelAmtPerDay * this.internationalTravelData.travelDays;
  //   console.log(this.internationalTravelData.fullAmt);
  // }

}