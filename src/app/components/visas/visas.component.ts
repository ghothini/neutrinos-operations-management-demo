import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-visas',
  templateUrl: './visas.component.html',
  styleUrls: ['./visas.component.scss']
})
export class VisasComponent {
  leaveStatuses: string[] = ['accept', 'decline'];
  manager: any;
  expandedIndex = 0;
  allVisaApplications: any;
  allManagerVisaApplications: any;
  allEmployees: any;
  employee: any;
  dateOfBirth: any = {
    year: '',
    month: '',
    day: ''
  }
  allVisaExtensionApplications: any;

  notification: any = {
    employeeId: '',
    status: '',
    managerId: '',
    seen: false,
    notificationType: 'Visa Application',
    direction: 'toEmployee'
  }

  constructor(private sharedService: SharedServiceService, 
    private snackbar: MatSnackBar, private router: Router,
    private location: Location){
    this.allVisaApplications = this.sharedService.get('visaApplications','local');
    this.manager = this.sharedService.get('manager', 'session');
    this.allManagerVisaApplications = this.allVisaApplications.filter((leave: any) => leave.managerId === this.manager.id).reverse();
    this.allEmployees = this.sharedService.get('employees','local');
    // Data for visa application picture
    this.allVisaApplications.forEach((visaApplication: any,indx: any) => {
      this.allEmployees.forEach((employee: any) => {
        if(employee.id === visaApplication.id){
          console.log(employee.profile.dateOfBirth)
          visaApplication['dateOfBirth'] = employee.profile.dateOfBirth;
           const dateOfBirth = visaApplication['dateOfBirth'].split('-');
          this.dateOfBirth.year = dateOfBirth[0].split('');
          this.dateOfBirth.month = dateOfBirth[1].split('');
          this.dateOfBirth.day = dateOfBirth[2].substring(0,2).split('');
          visaApplication['dateOfBirthArr'] = this.dateOfBirth;
        }
      })
    })
  }

  

  submitStatus(leaveStatus: string, visaApplicationId: string, employeeId: string): void {
    const allNotifications = this.sharedService.get('allNotifications', 'local');
    if (leaveStatus.toLowerCase() === 'accept') {
      this.allVisaApplications.forEach((application: any) => {
        if (application.visaApplicationId === visaApplicationId) {
          application.status = 'accepted';
          this.notification.status = 'accepted';
          this.notification['operatorId'] = this.manager.profile.operatorId;
          this.notification['id'] = `notification-${new Date().getTime()}`;
          this.snackbar.open('Leave status and notification updated successfully', 'Ok', { duration: 3000 });
          this.sharedService.set('visaApplications', 'local', this.allVisaApplications);
          this.sharedService.updateVisaApplictions(this.allVisaApplications);
        }
      })
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === employeeId) {
          this.notification.employeeId = employee.id
          this.notification.managerId = this.manager.id;
          employee.operationsOperated.visaApplications.forEach((visaApplication: any) => {
            if(visaApplication.visaApplicationId = visaApplicationId) {
              visaApplication.status = 'accepted';
              this.sharedService.set('employees', 'local', this.allEmployees);
              this.sharedService.set('employee', 'session', employee);
            }
          })
        }
      })
      allNotifications.push(this.notification)
      this.sharedService.set('allNotifications', 'local', allNotifications)
    }
    if (leaveStatus === 'decline') {
      this.allVisaApplications.forEach((visaApplication: any) => {
        if (visaApplication.visaApplicationId === visaApplicationId) {
          visaApplication.status = 'declined'
          this.notification.status = 'declined';
          this.notification['id'] = `notification-${new Date().getTime()}`;
          this.snackbar.open('Leave status and notification updated successfully', 'Ok', { duration: 3000 });
          this.sharedService.set('visaApplications', 'local', this.allVisaApplications);
          this.sharedService.updateVisaApplictions(this.allVisaApplications);
          return;
        }
      })

      this.allEmployees.forEach((employee: any) => {
        if (employee.id === employeeId) {
          employee.operationsOperated.visaApplications.forEach((visaApplication: any) => {
            if(visaApplication.visaApplicationId = visaApplicationId) {
              visaApplication.status = 'declined';
              this.sharedService.set('employees', 'local', this.allEmployees);
              this.sharedService.set('employee', 'session', employee);
            }
          })
          // this.sharedService.updateEmployeeAccount(employee);
        }
      })
      this.notification.employeeId = employeeId;
      this.notification.managerId = this.manager.id;
      allNotifications.push(this.notification)
      this.sharedService.set('allNotifications', 'local', allNotifications)
    }
  }
  
  goBack(): void {
    this.router.navigate(['/manager-landing'])
    // this.location.back();
    this.sharedService.updateshowNotificationsIcon()
    this.sharedService.updateOperationsShow();
  }
}
