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
  allNotifications: any;
  companyOperator: any;
  allManagers: any;
  managerId: any;
  visaApplicationData: any = {
    fullName: 'Thapelo Mokotelakoena',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    passportNo: '',
    birthCountry: '',
    expireDate: '',
    nationality: '',
    status: 'pending'
  }

  notification: any = {
    employeeId: '',
    lastName: '',
    managerId: '',
    seen: false,
    notificationType: 'Visa Application',
    direction: 'toManager'
  }

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
    this.employee = this.sharedService.get('employee', 'session');
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.allManagers = this.sharedService.get('managers', 'local');
    this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
    this.allNotifications = this.sharedService.get('allNotifications', 'local');
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
    this.employee.operationsOperated?.visaApplications.push(this.visaApplicationData);

    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        this.managerId = employee.profile.managerId;
      }
    })
    
    // Set company manager to form
    this.allManagers.forEach((manager: any) => {
      if (manager.id === this.managerId) {
        this.visaApplicationData['operator'] = manager.profile.operatorId;
        this.notification['operatorId'] = manager.profile.operatorId;
      }
    })

    // Update session and local storage and visa applications array
    this.sharedService.set('employee', 'session', this.employee);
    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        this.notification.employeeId = employee.id
        this.notification.managerId = employee.profile.managerId;
        this.managerId = employee.profile.managerId;
        this.notification['id'] = `notification-${new Date().getTime()}`;
        this.notification.lastName = employee.profile.fullName.split(' ')[1];
        employee.profile.operationsOperated.visaApplications.push(this.visaApplicationData);
      }
    })

    // Update session and local storage and visa applications array
    this.sharedService.set('employee', 'session', this.employee);
    this.sharedService.set('employees', 'local', this.allEmployees);

    this.allNotifications.push(this.notification);
    this.sharedService.set('allNotifications', 'local', this.allNotifications);
    this.sharedService.set('visaApplications', 'local', this.allVisaApplications);
    this.snackbar.open(`Visa was applied for successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }

}
