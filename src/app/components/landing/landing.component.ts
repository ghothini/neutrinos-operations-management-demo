import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ProfileComponent } from '../profile/profile.component';
import { LeaveApplicationComponent } from '../leave-application/leave-application.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OperationsOverviewComponent } from '../popups/operations-overview/operations-overview.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
  showRouter!: boolean;
  showOperations!: boolean;
  employee: any;
  allEmployees: any;
  sickLeaveDaysSubscription!: Subscription;
  annualLeaveDaysSubscrition!: Subscription;
  remainingSickLeaveDays: any;
  remainingAnnualLeaveDays: any;
  southAfricanTime: any;
  showNotifications: boolean = false;
  showPolicies: boolean = false;
  allNotifications: any;
  allPolicies: any;
  employeeNotifications: any;
  notificationsElement: any;
  toSignPolicy: any;
  isManager: any;
  manager: any;
  notificationButtonElement: any;
  employeePendingActions: string[] = [];
  showChangePassword = false;
  completedActions: string[] = [];

  constructor(private router: Router, private sharedService: SharedServiceService,
    private dialog: MatDialog, private snackbar: MatSnackBar) {
    // Show employee operations options or their routes
    const show: any = this.sharedService.initialOperationsShow();
    this.showRouter = show[0];
    this.showOperations = show[1];
    this.employee = this.sharedService.get('employee', 'session');
    this.getPendingActions();
    this.isManager = this.sharedService.get('temp', 'session')
    this.allPolicies = this.sharedService.get('policies', 'local');
    // this.checkManager();
    // Get employee notifications
    this.allNotifications = this.sharedService.get('allNotifications', 'local');
    this.employeeNotifications = this.allNotifications.filter((notification: any) => notification.employeeId === this.employee.id && !notification.seen && notification.direction === 'toEmployee').reverse();
    this.sharedService.watchRouterShow().subscribe((showRouterBoolean: boolean) => this.showRouter = showRouterBoolean);
    this.sharedService.watchOperationsShow().subscribe((showOperationsBoolean: boolean) => this.showOperations = showOperationsBoolean);
    this.sharedService.watchSickLeaveDays().subscribe((sickLeaveDays: any) => this.remainingSickLeaveDays = sickLeaveDays);
    this.sharedService.watchAnnualLeaveDays().subscribe((annualLeaveDays: any) => this.remainingAnnualLeaveDays = annualLeaveDays);
    this.sharedService.watchChangePasswrd().subscribe((changePasswrd: boolean) => this.showChangePassword = changePasswrd)
    this.remainingSickLeaveDays = this.employee.profile?.remainingSickLeaveDays;
    this.remainingAnnualLeaveDays = this.employee.profile?.remainingAnnualLeaveDays;
    console.log(this.remainingAnnualLeaveDays)

    if (this.employee.profile.password === '123') {
      this.showChangePassword = true;
    }

    //  Update showing of time
    setInterval(() => {
      this.allEmployees = this.sharedService.get('employees', 'local');
      const allLeaves = this.sharedService.get('allLeaves', 'local');
      this.southAfricanTime = this.updateDate()
      this.allEmployees.forEach((employee: any) => {
        if (employee.id === this.employee.id) {
          if (employee.profile.operationsOperated.visaApplications.length > 0 && !this.completedActions.includes('Visa Applications')) this.completedActions.push('Visa Applications');
          if (employee.profile.operationsOperated.visaExtensions.length > 0 && !this.completedActions.includes('Visa Extensions')) this.completedActions.push('Visa Extensions');
          if (employee.profile.operationsOperated.guesthouseServices.length > 0 && !this.completedActions.includes('Guesthouse Services')) this.completedActions.push('Guesthouse Services');
          if (employee.profile.operationsOperated.domesticTravels.length > 0 && !this.completedActions.includes('Domestic Travels')) this.completedActions.push('Domestic Travels');
          if (employee.profile.operationsOperated.flightsInformation.length > 0 && !this.completedActions.includes('Flights Information')) this.completedActions.push('Flights Information');
          if (employee.profile.operationsOperated.internationalTravels.length > 0 && !this.completedActions.includes('International Travels')) this.completedActions.push('International Travels');
        }
      })
      allLeaves.forEach((leave: any) => {
        if (leave.employeeId === this.employee.id && !this.completedActions.includes('Leave Applications')) {
          this.completedActions.push('Leave Applications');
        }
      })
    }, 1000)

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

  ngOnInit(): void {
    const changePasswrdElement = document.getElementById('changePasswrd') as HTMLElement;
    if (this.showChangePassword) {
      changePasswrdElement.style.display = 'flex'
    }

    if (this.showChangePassword) {
      setInterval(() => {
        changePasswrdElement.style.display = 'none'
      }, 1000)
    }
  }

  ngAfterViewInit(): void {
    this.notificationButtonElement = document.getElementById('notificationsBtn');
    this.notificationsElement = document.getElementById('notifications') as HTMLElement;
    this.notificationButtonElement?.addEventListener('click', () => {
      if (this.employeeNotifications.length < 1) {
        this.snackbar.open('No notifications updates to see', 'Ok', { duration: 3000 });
        return;
      }
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.notificationsElement?.classList.remove('hide')
      } else {
        this.notificationsElement?.classList.add('hide')
      }
    })
  }

  getPendingActions(): void {
    // Get employees pending actions
    if (this.employee.profile.operationsOperated.visaApplications.length > 0) this.employeePendingActions.push('Visa Application');
    if (this.employee.profile.operationsOperated.visaExtensions.length > 0) this.employeePendingActions.push('Visa Extension');
    if (this.employee.profile.operationsOperated.internationalTravels.length > 0) this.employeePendingActions.push('International Travel');
    if (this.employee.profile.operationsOperated.domesticTravels.length > 0) this.employeePendingActions.push('Domestic Travel');
    if (this.employee.profile.operationsOperated.flightsInformation.length > 0) this.employeePendingActions.push('Flight Information');
    if (this.employee.profile.operationsOperated.guesthouseServices.length > 0) this.employeePendingActions.push('Guesthouse Service');
    console.log(this.employeePendingActions);
  }

  updateDate(): any {
    // South Africa Time
    let currentHrs, currentMin, currentSec, currentMs, currentTime;
    var date = new Date();

    currentHrs = date.getHours();
    currentMin = date.getMinutes();
    currentSec = date.getSeconds();
    if (currentMin < 10) {
      currentMin = `0${currentMin}`;
    }
    if (currentSec < 10) {
      currentSec = `0${currentSec}`;
    }
    if (currentHrs < 10) {
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

  showOperationsOverview(operations: string): void {
    console.log(operations)
    this.dialog.open(OperationsOverviewComponent, {
      width: '100%',
      data: {
        _operation: operations
      }
    })
  }

  logOut(): void {
    sessionStorage.removeItem('employee')
    this.router.navigate(['/sign-in']);
  }

  requestLeave(): void {
    if (this.remainingSickLeaveDays === 0 && this.remainingAnnualLeaveDays === 0) {
      this.snackbar.open('You have no leave days remaining', 'Ok', { duration: 3000 });
      return;
    }
    this.dialog.open(LeaveApplicationComponent);
  }

  seenNotification(notificationId: any): void {
    this.employeeNotifications = this.employeeNotifications.filter((notification: any) => notification.id != notificationId);
    console.log(this.employeeNotifications);
    this.allNotifications.forEach((notification: any) => {
      if (notification.id === notificationId) {
        notification.seen = true;
        this.sharedService.set('allNotifications', 'local', this.allNotifications);
      }
    })
    this.snackbar.open('Notification deleted successfully', 'Ok', { duration: 3000 });
    // Hide notifications box
    if (this.employeeNotifications.length < 1) {
      this.notificationsElement.classList.add('hide');
    }
  }

  signPolicy(policy: any) {
    this.toSignPolicy = policy;
  }
  updateWatchClicks(): void {
    this.showPolicies = !this.showPolicies;
  }

  checkManager(): void {
    if (this.isManager.profile.dateOfBirth) {
      this.manager = this.sharedService.get('manager', 'session');
      this.employee = this.isManager;
    }
  }
}
