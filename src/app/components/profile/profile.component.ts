import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  employee: any;
  isManager: any;
  manager: any;
  profileFormData: any;
  loggedInSubscription!: Subscription
  constructor(private location: Location, private dialogRef: MatDialogRef<ProfileComponent>, private sharedService: SharedServiceService){
    this.employee = this.sharedService.get('employee','session');
    this.isManager = this.sharedService.get('temp','session')
    this.profileFormData = this.employee;
    // this.checkManager();
    // console.log(this.profileFormData)
    // this.loggedInSubscription = this.sharedService.watchEmployeeAccount().subscribe((employee: any) => {
    //   this.profileFormData = employee
    //   console.log(this.profileFormData);
    // });
  }

  checkManager(): void {
    if(this.isManager.profile.dateOfBirth) {
      this.manager = this.sharedService.get('manager','session');
      this.profileFormData = this.isManager;
    }}

  close(): void {
    this.dialogRef.close()
  }
}
