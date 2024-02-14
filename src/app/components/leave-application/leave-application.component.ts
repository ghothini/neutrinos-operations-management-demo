import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent {
  leaveFormGroup!: FormGroup;
  allEmployees: any;
  allManagers: any;
  managerId: any;
  employee: any;
  allLeaves: any;
  profileFormData: any;
  todayDate = new Date().toISOString().split("T")[0];
  allNotifications: any;
  isManager: any;
  manager: any;
  managerSwitched: boolean = false;

  notification: any = {
    employeeId: '',
    lastName: '',
    managerId: '',
    id: '',
    seen: false,
    notificationType: 'Leave Application',
    direction: 'toManager'
  }

  constructor(private location: Location, private dialogRef: MatDialogRef<LeaveApplicationComponent>,
    private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.employee = this.sharedService.get('employee', 'session');
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.isManager = this.sharedService.get('temp','session')
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.allManagers = this.sharedService.get('managers', 'local');
    this.allNotifications = this.sharedService.get('allNotifications', 'local');
    console.log(this.allLeaves);

    // this.profileFormData = this.employee;
    this.leaveFormGroup = new FormGroup({
      leaveType: new FormControl('', [Validators.required]),
      dateStartLeave: new FormControl('', [Validators.required]),
      dateEndLeave: new FormControl('', [Validators.required]),
    })
  }

  close(): void {
    this.dialogRef.close()
  }

  submit(): void {
    if (this.leaveFormGroup.invalid) return;
    const dateStartLeave = this.leaveFormGroup.value.dateStartLeave;
    const dateEndLeave = this.leaveFormGroup.value.dateEndLeave;

    if ((dateEndLeave - dateStartLeave) === 0) {
      this.snackbar.open(`Your leave duration can't start and end on the same day`, 'Ok', { duration: 3000 });
      return;
    }

    if (dateStartLeave > dateEndLeave) {
      this.snackbar.open(`The day your leave ends cannot be days before it starts`, 'Ok', { duration: 3000 });
      return;
    }

    const leaveDaysCount = (dateEndLeave - dateStartLeave) / (1000 * 60 * 60 * 24);

    const remainingAnnualLeaveDays = this.employee.profile.remainingAnnualLeaveDays;
    const remainingSickLeaveDays = this.employee.profile.remainingSickLeaveDays;
    if (this.leaveFormGroup.value.leaveType === 'annual') {
      if (remainingAnnualLeaveDays < leaveDaysCount) {
        this.snackbar.open(`You only have ${remainingAnnualLeaveDays} annual leave days remaining`, 'Ok', { duration: 3000 });
        return;
      }
      this.employee.profile.remainingAnnualLeaveDays = this.employee.profile.remainingAnnualLeaveDays - leaveDaysCount;
      this.employee.profile.approvedLeaveCount++;
      this.sharedService.updateAnnualLeaveDays(this.employee)
      if(this.managerSwitched){
        this.sharedService.set('manager', 'session', this.employee);
      } else {
        this.sharedService.set('employee', 'session', this.employee);
      }
      // this.sharedService.updateAnnualLeaveDays(this.employee)
      this.profileFormData = {
        ...this.leaveFormGroup.value,
        employeeId: this.employee.id,
        id: `leave-${new Date().getTime()}`,
        status: 'pending',
        managerId: this.employee.profile.managerId ? this.employee.profile.managerId : null,
        approvedLeaveCount: this.employee.profile.approvedLeaveCount,
        remainingAnnualLeaveDays: this.employee.profile.remainingAnnualLeaveDays,
        remainingSickLeaveDays: this.employee.profile.remainingSickLeaveDays
      }
      console.log(this.profileFormData);

      // Add company operator to leave
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === this.employee.id) {
          this.managerId = employee.profile.managerId;
        }
      })

      // Set company manager to form
      this.allManagers.forEach((manager: any) => {
        if (manager.id === this.managerId) {
          this.profileFormData['operator'] = manager.profile.operatorId;
          this.notification['operatorId'] = manager.profile.operatorId;
        }
      })
      this.allLeaves.push(this.profileFormData);
      this.sharedService.set('allLeaves', 'local', this.allLeaves)
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === this.employee.id) {
          this.notification.employeeId = employee.id
          this.notification.managerId = employee.profile.managerId;
          this.notification['id'] = `notification-${new Date().getTime()}`;
          this.notification.lastName = employee.profile.fullName.split(' ')[1];
          employee.profile.approvedLeaveCount = this.employee.profile.approvedLeaveCount;
          employee.profile.remainingAnnualLeaveDays = this.employee.profile.remainingAnnualLeaveDays;
          this.sharedService.set('employees', 'local', this.allEmployees);
        }
      })
      this.allNotifications.push(this.notification);
      this.sharedService.set('allNotifications', 'local', this.allNotifications);
      this.snackbar.open('Leave application has been successfully sent', 'Ok', { duration: 3000 });
      this.sharedService.updateAllLeaves(this.allLeaves)
      this.dialogRef.close();
    } else {
      if (remainingSickLeaveDays < leaveDaysCount) {
        this.snackbar.open(`You only have ${remainingSickLeaveDays} sick leave days remaining`, 'Ok', { duration: 3000 });
        return;
      }
      this.employee.profile.remainingSickLeaveDays = this.employee.profile.remainingSickLeaveDays - leaveDaysCount;
      this.employee.profile.approvedLeaveCount++;
      this.sharedService.set('employee', 'session', this.employee);
      this.sharedService.updateSickLeaveDays(this.employee);
      this.profileFormData = {
        ...this.leaveFormGroup.value,
        employeeId: this.employee.id,
        id: `leave-${new Date().getTime()}`,
        status: 'pending',
        managerId: this.employee.profile.managerId,
        approvedLeaveCount: this.employee.profile.approvedLeaveCount,
        remainingAnnualLeaveDays: this.employee.profile.remainingAnnualLeaveDays,
        remainingSickLeaveDays: this.employee.profile.remainingSickLeaveDays
      }
      console.log(this.profileFormData)
      // Add company operator to leave
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === this.employee.id) {
          this.managerId = employee.profile.managerId;
        }
      })

      // Set company manager to form
      this.allManagers.forEach((manager: any) => {
        if (manager.id === this.managerId) {
          this.profileFormData['operator'] = manager.profile.operatorId;
          this.notification['operatorId'] = manager.profile.operatorId;
        }
      })
      this.allLeaves.push(this.profileFormData);
      this.sharedService.set('allLeaves', 'local', this.allLeaves)
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === this.employee.id) {
          this.notification.employeeId = employee.id
          this.notification.managerId = employee.profile.managerId;
          this.notification['id'] = `notification-${new Date().getTime()}`;
          this.notification.lastName = employee.profile.fullName.split(' ')[1];
          employee.profile.approvedLeaveCount = this.employee.profile.approvedLeaveCount;
          employee.profile.remainingSickLeaveDays = this.employee.profile.remainingSickLeaveDays;
          this.sharedService.set('employees', 'local', this.allEmployees);
        }
      })
      this.allNotifications.push(this.notification);
      this.sharedService.set('allNotifications', 'local', this.allNotifications);
      this.snackbar.open('Leave application has been successfully sent', 'Ok', { duration: 3000 });
      this.sharedService.updateAllLeaves(this.allLeaves);
      this.dialogRef.close();
    }
  }

  checkManager(): void {
    if(this.isManager.length > 0) {
      this.managerSwitched = true;
      this.manager = this.sharedService.get('manager','session');
      // this.profileFormData = this.isManager;
    }}
}
