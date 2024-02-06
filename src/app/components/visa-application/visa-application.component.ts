import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-visa-application',
  templateUrl: './visa-application.component.html',
  styleUrls: ['./visa-application.component.scss']
})
export class VisaApplicationComponent {
  employee: any;
  allEmployees: any;
  allVisaApplications: any;
  visaApplicationData: any = {
    fullName: 'Thapelo Mokotelakoena',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    passportNo: '',
    birthCountry: '',
    expireDate: '',
    nationality: ''
  }

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
      this.employee = this.sharedService.get('employee','session');
      this.allEmployees = this.sharedService.get('employees','local');
      this.allVisaApplications = this.sharedService.get('visaApplications','local');
     }
  goBack(): void {
    this.location.back();
    this.sharedService.updateOperationsShow();
  }

  submit(): void {
    this.allVisaApplications.push(this.visaApplicationData);
    this.allVisaApplications[this.allVisaApplications.length - 1] = {
      ...this.allVisaApplications[this.allVisaApplications.length - 1],
      id: this.employee.id,
      managerId: this.employee.profile.managerId,
      visaApplicationId: `visa-application-${new Date().getTime()}`,
      status: 'pending'
    }
    this.visaApplicationData = this.allVisaApplications[this.allVisaApplications.length - 1];
    console.log(this.visaApplicationData);
    this.employee.operationsOperated.visaApplications.push(this.visaApplicationData);
    // Update session and local storage and visa applications array
    this.sharedService.set('employee','session',this.employee);
    this.allEmployees.forEach((employee: any) => {
      if(employee.id === this.employee.id){
        employee.operationsOperated.visaApplications.push(this.visaApplicationData);
        this.sharedService.set('employees','local',this.allEmployees);
      }
    })
    this.sharedService.set('visaApplications','local',this.allVisaApplications);
    this.snackbar.open(`Visa was applied for successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }

}
