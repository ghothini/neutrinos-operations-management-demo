import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent {
  allLeaves: any;
  allManagerLeaves: any;
  allEmployees: any;
  manager: any;
  displayedColumns: string[] = ['leaveId', 'leaveType', 'leaveStartDate', 'leaveEndDate', 'status'];
  dataSource: any;
  dataSourceAcceptedStatus: any;
  leaveStatuses: string[] = ['accept', 'decline'];
  allLeavesSubscription: Subscription;

  notification: any = {
    employeeId: '',
    status: '',
    managerId: '',
    seen: false,
    notificationType: 'Leave Application',
    direction: 'toEmployee'
  }

  constructor(private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.manager = this.sharedService.get('manager', 'session');
    this.allManagerLeaves = this.allLeaves.filter((leave: any) => leave.managerId === this.manager.id);
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.dataSource = this.allManagerLeaves.reverse();
    this.allLeavesSubscription = this.sharedService.watchAllLeaves().subscribe((allLeaves: any) => {
      this.dataSource = allLeaves.reverse();
      const managerLeaves = allLeaves.filter((leave: any) => leave.managerId === this.manager.id);

      // Filter with accepted
      this.dataSourceAcceptedStatus = managerLeaves.filter((leave: any) => leave.status === 'accepted').reverse();
    })
    // Filter with accepted
    this.dataSourceAcceptedStatus = this.allManagerLeaves.filter((leave: any) => leave.status === 'accepted').reverse();
  }

  submitStatus(leaveStatus: string, leaveId: string, employeeId: string, leaveStartDate: string, leaveEndDate: string): void {
    const allNotifications = this.sharedService.get('allNotifications', 'local');
    if (leaveStatus === 'accept') {
      this.allLeaves.forEach((leave: any) => {
        if (leave.id === leaveId) {
          this.notification.status = 'accepted';
          leave.status = 'accepted';
          this.notification['id'] = `notification-${new Date().getTime()}`;
          leave['pendingLeaveDuration'] = `${this.convertDate(leave.dateStartLeave)} - ${this.convertDate(leave.dateEndLeave)}`;
          this.snackbar.open('Leave status and notification updated successfully', 'Ok', { duration: 3000 });
          this.sharedService.set('allLeaves', 'local', this.allLeaves);
          this.sharedService.updateAllLeaves(this.allLeaves);
        }
      })
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === employeeId) {
          this.notification.employeeId = employee.id
          this.notification.managerId = this.manager.id;
          employee.profile['pendingLeaveDuration'] = `${this.convertDate(leaveStartDate)} - ${this.convertDate(leaveEndDate)}`;
          this.sharedService.set('employees', 'local', this.allEmployees);
          this.sharedService.set('employee', 'session', employee);
          this.sharedService.updateEmployeeAccount(employee);
        }
      })
      allNotifications.push(this.notification)
      this.sharedService.set('allNotifications', 'local', allNotifications)
    }
    if (leaveStatus === 'decline') {
      this.allLeaves.forEach((leave: any) => {
        if (leave.id === leaveId) {
          leave.status = 'declined'
          this.notification.status = 'declined';
          this.notification['id'] = `notification-${new Date().getTime()}`;
          this.snackbar.open('Leave status and notification updated successfully', 'Ok', { duration: 3000 });
          this.sharedService.set('allLeaves', 'local', this.allLeaves);
          this.sharedService.updateAllLeaves(this.allLeaves);
          return;
        }
      })
      this.notification.employeeId = employeeId;
      this.notification.managerId = this.manager.id;
      allNotifications.push(this.notification)
      this.sharedService.set('allNotifications', 'local', allNotifications)
    }
  }

  convertDate(_startDate: string): any {
    let dateStart = _startDate;
    let dateStartArr = dateStart.split('-')
    let correctDate: any = dateStartArr[2].substr(0, 2)
    correctDate = Number(correctDate) + 1
    dateStart = `${dateStartArr[0]}/${dateStartArr[1]}/${correctDate}`
    return dateStart;
  }
}
