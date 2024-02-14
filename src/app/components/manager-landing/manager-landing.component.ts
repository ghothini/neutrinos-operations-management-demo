import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-manager-landing',
  templateUrl: './manager-landing.component.html',
  styleUrls: ['./manager-landing.component.scss']
})
export class ManagerLandingComponent implements OnInit {
  showRouter: boolean;
  showOperations: boolean;
  allLeaves: any;
  pendingDefaultActions: any;
  allVisaApplications: any;
  pendingVisaApplications: any;
  pendingLeaves: any;
  manager: any;
  remainingSickLeaveDays: any;
  remainingAnnualLeaveDays: any;
  chart: any;
  operationsSubscription: Subscription;
  routerSubscription: Subscription;
  chartContainer: any;
  notificationsElement: any;
  showNotifications: boolean = false;
  showNotificationsIcon: boolean = true;
  allNotifications: any;
  managerNotifications: any;
  allManagerLeaves: any;
  allManagerVisaApplications: any;
  isOperator: any;
  operator: any;
  notificationButtonElement: any;
  notificationCountElement: any;

  constructor(private sharedService: SharedServiceService, private router: Router,
    private snackbar: MatSnackBar) {
    this.manager = this.sharedService.get('manager', 'session');
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.isOperator = this.sharedService.get('temp', 'session')
    this.checkOperator();
    if (this.isOperator.profile) {
      this.allManagerLeaves = this.allLeaves
      this.pendingLeaves = this.allManagerLeaves;
      this.allNotifications = this.sharedService.get('allNotifications', 'local');
      this.allVisaApplications = this.sharedService.get('visaApplications', 'local');

      this.allNotifications = this.sharedService.get('allNotifications', 'local');
      this.managerNotifications = this.allNotifications.filter((notification: any) => notification.notificationType.toLowerCase() === 'leave application' || notification.notificationType.toLowerCase() === 'visa application');
      // console.log(this.managerNotifications)
      this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
      this.allManagerVisaApplications = this.allVisaApplications;
      // Pending visa applications
      this.pendingVisaApplications = this.allVisaApplications
      this.sharedService.watchAllLeaves().subscribe((allLeaves: any) => {
        this.pendingLeaves = allLeaves;
        this.updateChartData(allLeaves);
        console.log()
      })
      this.sharedService.watchVisaApplications().subscribe((visaApplications: any) => {
        this.allManagerVisaApplications = visaApplications
        this.pendingVisaApplications = this.allManagerVisaApplications
        this.updateChartApplicationsData(this.pendingVisaApplications);
      })

    } else {
      this.allManagerLeaves = this.allLeaves.filter((leave: any) => leave.managerId === this.manager.id);
      this.pendingLeaves = this.allManagerLeaves.filter((leave: any) => leave.status.toLowerCase() === 'pending')

      this.allNotifications = this.sharedService.get('allNotifications', 'local');
      this.managerNotifications = this.allNotifications.filter((notification: any) => notification.managerId === this.manager.id && notification.direction === 'toManager' && !notification.seen).reverse();
      // console.log(this.managerNotifications)
      this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
      this.allManagerVisaApplications = this.allVisaApplications.filter((application: any) => application.managerId === this.manager.id);

      // Pending visa applications
      this.pendingVisaApplications = this.allManagerVisaApplications.filter((visaApplication: any) => visaApplication.status === 'pending');
      this.sharedService.watchAllLeaves().subscribe((allLeaves: any) => {
        this.pendingLeaves = allLeaves.filter((leave: any) => leave.status.toLowerCase() === 'pending');
        this.updateChartData(this.pendingLeaves);
      })
      this.sharedService.watchVisaApplications().subscribe((visaApplications: any) => {
        this.allManagerVisaApplications = visaApplications.filter((application: any) => application.managerId === this.manager.id);
        this.pendingVisaApplications = this.allManagerVisaApplications.filter((visaApplication: any) => visaApplication.status === 'pending');
        this.updateChartApplicationsData(this.pendingVisaApplications);
      })
    }
    this.sharedService.watchNotificationIcon().subscribe((show: any) => {
      this.showNotificationsIcon = show;
    })
    // Show employee operations options or their routes
    const show: any = this.sharedService.initialOperationsShow();
    this.showRouter = show[0];
    this.showOperations = show[1];
    this.routerSubscription = this.sharedService.watchRouterShow().subscribe((showRouterBoolean: boolean) => this.showRouter = showRouterBoolean);
    this.operationsSubscription = this.sharedService.watchOperationsShow().subscribe((showOperationsBoolean: boolean) => {
      this.showOperations = showOperationsBoolean;
      this.notificationButtonElement.style.display = 'flex';
      this.notificationCountElement.style.display = 'flex';
    });
  }

  checkOperator(): void {
    if (this.isOperator.length > 0) {
      this.operator = this.sharedService.get('operator', 'session');
      this.manager = this.isOperator;
    }
  }

  ngOnInit(): void {

    this.notificationButtonElement = document.getElementById('notificationButton') as HTMLElement;
    this.notificationCountElement = document.getElementById('notificationsCount') as HTMLElement;
    this.notificationCountElement = document.getElementById('notificationsCount') as HTMLElement;
    this.notificationsElement = document.getElementById('notifications');
    this.notificationButtonElement?.addEventListener('click', () => {
      if (this.managerNotifications.length < 1) {
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

    if (this.pendingLeaves.length === 0 && this.pendingVisaApplications.length === 0) {
      this.pendingDefaultActions = 1;
    } else {
      this.pendingDefaultActions = 0;
    }

    this.chartContainer = document.getElementById('pie-chart') as HTMLCanvasElement;
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Leaves', 'Pending Visa Applications'],
        datasets: [{
          backgroundColor: ['#a99494', '#3f51b5', '#95a4b5'],
          data: [this.pendingLeaves.length, this.pendingVisaApplications.length]
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

  }

  updateChartData(pendingLeaves: any): void {
    if (pendingLeaves.length === 0 && this.pendingVisaApplications.length === 0) {
      this.pendingDefaultActions = 1;
    } else {
      this.pendingDefaultActions = 0;
    }
    this.chart.destroy();
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Leaves', 'Pending Visa Applications'],
        datasets: [{
          backgroundColor: ['#a99494', '#3f51b5'],
          data: [pendingLeaves.length, this.pendingVisaApplications.length]
        }]
      },
      options: {
        scales: {
          y: {
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    })
  }


  updateChartApplicationsData(pendingVisaApplications: any): void {
    if (this.pendingLeaves.length === 0 && this.pendingVisaApplications.length === 0) {
      this.pendingDefaultActions = 1;
    } else {
      this.pendingDefaultActions = 0;
    }

    this.chart.destroy();
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Leaves', 'Pending Visa Applications'],
        datasets: [{
          backgroundColor: ['#a99494', '#3f51b5'],
          data: [this.pendingLeaves.length, pendingVisaApplications.length]
        }]
      },
      options: {
        scales: {
          y: {
            grid: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    })
  };

  showProfile(): void {
    // this.dialog.open(ProfileComponent)
  }

  logOut(): void {
    sessionStorage.removeItem('manager');
    sessionStorage.removeItem('temp');
    sessionStorage.removeItem('operator');
    this.router.navigate(['/sign-in']);
  }

  requestLeave(): void {
    // if(this.remainingSickLeaveDays === 0 && this.remainingAnnualLeaveDays === 0) {
    //   this.snackbar.open('You have no leave days remaining','Ok',{duration: 3000});
    //   return;
    // }
    // this.dialog.open(LeaveApplicationComponent);
  }

  showLeaves(): void {
    this.showNotificationsIcon = false;
    this.sharedService.updateOperationsShow();
    this.notificationButtonElement.style.display = 'none';
    this.notificationCountElement.style.display = 'none';
    this.router.navigate(['/manager-landing/leaves']);
  }

  showVisas(): void {
    if (this.allManagerVisaApplications.length === 0) {
      this.snackbar.open('No visa applications to act on yet', 'Ok', { duration: 3000 });
      return;
    }
    this.showNotificationsIcon = false;
    this.sharedService.updateOperationsShow();
    this.notificationButtonElement.style.display = 'none';
    this.notificationCountElement.style.display = 'none';
    this.router.navigate(['/manager-landing/visas']);
  }

  seenNotification(notificationId: any): void {
    console.log(notificationId)
    this.managerNotifications = this.managerNotifications.filter((notification: any) => notification.id != notificationId);
    console.log(this.managerNotifications);
    this.allNotifications.forEach((notification: any) => {
      if (notification.id === notificationId) {
        notification.seen = true;
        this.sharedService.set('allNotifications', 'local', this.allNotifications);
      }
    })
    this.snackbar.open('Notification deleted successfully', 'Ok', { duration: 3000 });
    // Hide notifications box
    if (this.managerNotifications.length < 1) {
      this.notificationsElement.classList.add('hide');
    }
  }

  switchAcc(): void {
    this.snackbar.open('Successfully switched account', 'Ok', { duration: 3000 });
    this.sharedService.set('temp', 'session', this.manager);
    this.router.navigate(['/manager-employee-landing']);
  }

}
