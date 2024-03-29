import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-visa-extension',
  templateUrl: './visa-extension.component.html',
  styleUrls: ['./visa-extension.component.scss']
})
export class VisaExtensionComponent {
  employee: any;
  allEmployees: any;
  allVisaExtensions: any;
  managerId: any;
  allManagers: any;
  allNotifications: any;
  todayDate = new Date().toISOString().split("T")[0];
  visaExtensionData: any = {
    fullName: 'Thapelo Mokotelakoena',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    passportNo: '',
    expireDate: null,
    renewalDate: null,
    time: '',
    status: 'pending'
  }

  notification: any = {
    employeeId: '',
    lastName: '',
    managerId: '',
    id: '',
    seen: false,
    notificationType: 'Visa Extension Application'
  }

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
      this.employee = this.sharedService.get('employee','session');
      this.allEmployees = this.sharedService.get('employees','local');
      this.allManagers = this.sharedService.get('managers','local');
      this.allVisaExtensions = this.sharedService.get('visaExtensionApplications','local');
      this.allNotifications = this.sharedService.get('allNotifications', 'local');
      console.log(this.allVisaExtensions)
     }
  goBack(): void {
    this.location.back();
    this.sharedService.updateOperationsShow();
  }
  submit(): void {
    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        this.managerId = employee.profile.managerId;
        this.notification.employeeId = employee.id
        this.notification.managerId = employee.profile.managerId;
        this.visaExtensionData['managerId'] = employee.profile.managerId;
      }
    })
    
    // Set company manager to form
    this.allManagers.forEach((manager: any) => {
      if (manager.id === this.managerId) {
        this.visaExtensionData['operator'] = manager.profile.operatorId;
        this.notification['operatorId'] = manager.profile.operatorId;
      }
    })
    this.employee.profile.operationsOperated.visaExtensions.push(this.visaExtensionData);

    // Update session and local storage and visa extensions array
    
    this.sharedService.set('employee','session',this.employee);
    this.allEmployees.forEach((employee: any) => {
      if(employee.id === this.employee.id){
        this.notification['id'] = `notification-${new Date().getTime()}`;
        this.notification.lastName = employee.profile.fullName.split(' ')[1];
        employee.profile.operationsOperated.visaExtensions.push(this.visaExtensionData);
        this.sharedService.set('employees','local',this.allEmployees);
      }
    })
    this.allVisaExtensions.push(this.visaExtensionData);
    this.allVisaExtensions[this.allVisaExtensions.length - 1] = {
      ...this.allVisaExtensions[this.allVisaExtensions.length - 1],
      id: this.employee.id
    }
    this.allNotifications.push(this.notification);
    this.sharedService.set('allNotifications', 'local', this.allNotifications);
    this.sharedService.set('visaExtensionApplications','local',this.allVisaExtensions);
    this.snackbar.open(`Visa Extensionn was requested successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }
}
