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
  allEmployees: any;
  displayedColumns: string[] = ['leaveId', 'leaveType', 'leaveStartDate', 'leaveEndDate', 'status'];
  dataSource: any;
  dataSourceAcceptedStatus: any;
  leaveStatuses: string[] = ['accept', 'decline'];
  allLeavesSubscription: Subscription;

  constructor(private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.dataSource = this.allLeaves;
    this.allLeavesSubscription = this.sharedService.watchAllLeaves().subscribe((allLeaves: any) => {
      this.dataSource = allLeaves;
      // Filter with accepted
      this.dataSourceAcceptedStatus = allLeaves.filter((leave: any) => leave.status === 'accepted');
    })
    // Filter with accepted
    this.dataSourceAcceptedStatus = this.allLeaves.filter((leave: any) => leave.status === 'accepted');
    console.log(this.dataSourceAcceptedStatus);
  }

  submitStatus(leaveStatus: string, leaveId: string,employeeId: string,leaveStartDate: string, leaveEndDate:string): void {
    if (leaveStatus === 'accept') {
      this.allLeaves.forEach((leave: any) => {
        if (leave.id === leaveId) {
          leave.status = 'accepted';
          leave['pendingLeaveDuration'] = `${this.convertDate(leave.dateStartLeave)} - ${this.convertDate(leave.dateEndLeave)}`;
          this.snackbar.open('Leave status updated successfully','Ok',{duration: 3000});
          this.sharedService.set('allLeaves','local',this.allLeaves);
          this.sharedService.updateAllLeaves(this.allLeaves);
        }
      })
      this.allEmployees.forEach((employee: any) => {
        if(employee.id === employeeId){
          employee.profile['pendingLeaveDuration'] = `${this.convertDate(leaveStartDate)} - ${this.convertDate(leaveEndDate)}`;
          this.sharedService.set('employees','local',this.allEmployees);
          this.sharedService.set('employee','session',employee);
          this.sharedService.updateEmployeeAccount(employee);
        }
      })
    }
    if (leaveStatus === 'decline') {
      this.allLeaves.forEach((leave: any) => {
        if (leave.id === leaveId) {
          leave.status = 'declined'
          this.snackbar.open('Leave status updated successfully', 'Ok', { duration: 3000 });
          this.sharedService.set('allLeaves', 'local', this.allLeaves);
          this.sharedService.updateAllLeaves(this.allLeaves);
          return;
        }
      })
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
