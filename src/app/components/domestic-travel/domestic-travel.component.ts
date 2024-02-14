import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-domestic-travel',
  templateUrl: './domestic-travel.component.html',
  styleUrls: ['./domestic-travel.component.scss']
})
export class DomesticTravelComponent {
  employee: any;
  allEmployees: any;
  allManagers: any;
  allDomesticTravels: any;
  managerId: any;
  allNotifications: any;
  todayDate = new Date().toISOString().split("T")[0];
  domesticTravelFormData: any = {
    dateOfRequest: '',
    confirmedTravelDate: '',
    prefferedTravelTime: '',
    confirmedReturnDate: '',
    prefferedReturnTime: '',
    customerName: '',
    projectName: '',
    currensy: ''
  }
  employeeCredentialsFormData: any = {
    surname: 'Mokotelakoena',
    name: 'Thapelo',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    managerName: 'Goitsemang',
    managerEmail: 'goitse@neutrinos.com'
  }

  notification: any = {
    employeeId: '',
    lastName: '',
    managerId: '',
    id: '',
    seen: false,
    notificationType: 'Domestic Travel Request'
  }

  currensies: string[] = ['1 ZAR (South African Rand)','1 INR/ 0.22484 ZAR (Indian Rupee/South African Rand)'];

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
      this.employee = this.sharedService.get('employee','session');
      this.allEmployees = this.sharedService.get('employees','local');
      this.allNotifications = this.sharedService.get('allNotifications', 'local');
      this.allManagers = this.sharedService.get('managers','local');
      this.allDomesticTravels = this.sharedService.get('domesticTravels','local');
     }
  goBack(): void {
    this.location.back();
    this.sharedService.updateOperationsShow();
  }

  submit(): void {
    const domesticTravel = {
      ...this.domesticTravelFormData,
      credentials: {
        ...this.employeeCredentialsFormData
      }
    }

    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        this.managerId = employee.profile.managerId;
        this.notification.employeeId = employee.id
        this.notification.managerId = employee.profile.managerId;
      }
    })
    
    // Set company operator to form
    this.allManagers.forEach((manager: any) => {
      if (manager.id === this.managerId) {
        domesticTravel['operator'] = manager.profile.operatorId;
        this.notification['operatorId'] = manager.profile.operatorId;
      }
    })

    this.employee.profile.operationsOperated.domesticTravels.push(domesticTravel);
    // Update session and local storage and domestic travels array
    this.sharedService.set('employee','session',this.employee);
    this.allEmployees.forEach((employee: any) => {
      if(employee.id === this.employee.id){
        this.notification['id'] = `notification-${new Date().getTime()}`;
        this.notification.lastName = employee.profile.fullName.split(' ')[1];
        employee.profile.operationsOperated.domesticTravels.push(domesticTravel);
        this.sharedService.set('employees','local',this.allEmployees);
      }
    })
    this.allDomesticTravels.push(domesticTravel);
    this.allDomesticTravels[this.allDomesticTravels.length - 1] = {
      ...this.allDomesticTravels[this.allDomesticTravels.length - 1],
      id: this.employee.id
    }
    this.allNotifications.push(this.notification);
    console.log(this.allNotifications)
    this.sharedService.set('allNotifications', 'local', this.allNotifications);
    this.sharedService.set('domesticTravels','local',this.allDomesticTravels);
    this.snackbar.open(`Domestic travel was requested successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }
}
