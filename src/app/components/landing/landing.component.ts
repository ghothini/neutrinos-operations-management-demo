import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ProfileComponent } from '../profile/profile.component';
import { LeaveApplicationComponent } from '../leave-application/leave-application.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  showRouter!: boolean;
  showOperations!: boolean;
  employee: any;
  routerSubscription: Subscription;
  operationsSubscription: Subscription;
  sickLeaveDaysSubscription!: Subscription;
  annualLeaveDaysSubscrition!: Subscription;
  remainingSickLeaveDays: any;
  remainingAnnualLeaveDays: any;
  southAfricanTime: any;
  constructor(private router: Router, private sharedService: SharedServiceService,
    private dialog: MatDialog, private snackbar: MatSnackBar) {
    // Show employee operations options or their routes
    const show: any = this.sharedService.initialOperationsShow();
    this.showRouter = show[0];
    this.showOperations = show[1];
    this.employee = this.sharedService.get('employee', 'session');
    this.routerSubscription = this.sharedService.watchRouterShow().subscribe((showRouterBoolean: boolean) => this.showRouter = showRouterBoolean);
    this.operationsSubscription = this.sharedService.watchOperationsShow().subscribe((showOperationsBoolean: boolean) => this.showOperations = showOperationsBoolean);
    this.sickLeaveDaysSubscription = this.sharedService.watchSickLeaveDays().subscribe((sickLeaveDays: any) => this.remainingSickLeaveDays = sickLeaveDays);
    this.annualLeaveDaysSubscrition = this.sharedService.watchAnnualLeaveDays().subscribe((annualLeaveDays: any) => this.remainingAnnualLeaveDays = annualLeaveDays);
    this.remainingSickLeaveDays = this.employee.profile.remainingSickLeaveDays;
    this.remainingAnnualLeaveDays = this.employee.profile.remainingAnnualLeaveDays;
    //  Update showing of time
    setInterval(() => {
      this.southAfricanTime = this.updateDate()
    },1000)
    
    // const employees = [
    //   {
    //     "startWorkDay": "",
    //     "id": "employee-1706750205863",
    //     "profile": {
    //       email: 'ghothini@gmail.com',
    //       password: '123',
    //       fullName: "Thapelo Mokotelakoena",
    //       cellphoneNo: '072 714 8449',
    //       dateJoinedCompany: '2024-02-20T22:00:00.000Z',
    //       gender: 'Male',
    //       role: 'Employee',
    //       dateOfBirth: '1996-05-27T22:00:00.000Z',
    //       homeAddress: 'Johannes Drive 232, Sandton Street',
    //       manager: 'Jimmy Hedrix',
    //       managerId: 'manager-1707138617219',
    //       remainingSickLeaveDays: 15,
    //       remainingAnnualLeaveDays: 30,
    //       approvedLeaveCount: 0,
    //       pendingLeaveDuration: 'None'
    //     },
    //     "operationsOperated": {
    //       "visaExtensions": [],
    //       "visaApplications": [],
    //       "flightsInformation": [],
    //       "guesthouseServices": [],
    //       "internationalTravels": [],
    //       "domesticTravels": []
    //     }
    //   },
    //   {
    //     "startWorkDay": "",
    //     "id": "employee-1706750542929",
    //     "profile": {
    //       email: 'thapelo@gmail.com',
    //       password: '123',
    //       fullName: "Precious Molefi",
    //       cellphoneNo: '060 123 5684',
    //       dateJoinedCompany: '2012-02-19T22:00:00.000Z',
    //       gender: 'Female',
    //       role: 'Employee',
    //       dateOfBirth: '1986-02-13T22:00:00.000Z',
    //       homeAddress: 'East London, West Side 1818',
    //       manager: 'Jimmy Hedrix',
    //       managerId: 'manager-1706750245643',
    //       remainingSickLeaveDays: 15,
    //       remainingAnnualLeaveDays: 30,
    //       approvedLeaveCount: 0,
    //       pendingLeaveDuration: 'None'
    //     },
    //     "operationsOperated": {
    //       "visaExtensions": [],
    //       "visaApplications": [],
    //       "flightsInformation": [],
    //       "guesthouseServices": [],
    //       "internationalTravels": [],
    //       "domesticTravels": []
    //     }
    //   }
    // ]
    // this.sharedService.set('employees','local',employees);
  }

  updateDate(): any {
    // South Africa Time
    let currentHrs, currentMin, currentSec, currentMs, currentTime;
    var date = new Date();

    currentHrs = date.getHours();
    currentMin = date.getMinutes();
    currentSec = date.getSeconds();
    if(currentMin < 10) {
      currentMin = `0${currentMin}`;
    }
    if(currentSec < 10) {
      currentSec = `0${currentSec}`;
    }
    if(currentHrs < 10) {
      currentHrs = `0${currentHrs}`;
    }
    currentTime = currentHrs + ':' + currentMin + ':' + currentSec;
    return currentTime;
  }

  showVisaExtensionForm(): void {
    this.router.navigate(['/landing/visa-extension']);
    this.sharedService.updateOperationsShow();
  }

  showFlightInformationForm(): void {
    this.router.navigate(['/landing/flight-information']);
    this.sharedService.updateOperationsShow();
  }

  showGuesthouseServiceForm(): void {
    this.router.navigate(['/landing/guesthouse-service']);
    this.sharedService.updateOperationsShow();
  }

  showInternationalTravelForm(): void {
    this.router.navigate(['/landing/international-travel']);
    this.sharedService.updateOperationsShow();
  }

  showDomesticTravelForm(): void {
    this.router.navigate(['/landing/domestic-travel']);
    this.sharedService.updateOperationsShow();
  }

  showVisaApplicationForm(): void {
    this.router.navigate(['/landing/visa-application']);
    this.sharedService.updateOperationsShow();
  }

  showProfile(): void {
    this.dialog.open(ProfileComponent)
  }

  logOut(): void {
    this.router.navigate(['/sign-in']);
  }

  requestLeave(): void {
    if (this.remainingSickLeaveDays === 0 && this.remainingAnnualLeaveDays === 0) {
      this.snackbar.open('You have no leave days remaining', 'Ok', { duration: 3000 });
      return;
    }
    this.dialog.open(LeaveApplicationComponent);
  }
}
