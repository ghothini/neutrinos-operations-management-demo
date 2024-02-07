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
  allNotifications: any;
  managerNotifications: any;
  allManagerLeaves: any;
  allManagerVisaApplications: any;

  constructor(private sharedService: SharedServiceService, private router: Router,
    private snackbar: MatSnackBar) {
    this.manager = this.sharedService.get('manager', 'session');
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.allManagerLeaves = this.allLeaves.filter((leave: any) => leave.managerId === this.manager.id);
    this.pendingLeaves = this.allManagerLeaves.filter((leave: any) => leave.status.toLowerCase() === 'pending')
    this.allNotifications = this.sharedService.get('allNotifications', 'local');
    this.managerNotifications = this.allNotifications.filter((notification: any) => notification.managerId === this.manager.id && notification.direction === 'toManager' && !notification.seen).reverse();
    // console.log(this.managerNotifications)
    this.allVisaApplications = this.sharedService.get('visaApplications','local');
    this.allManagerVisaApplications = this.allVisaApplications.filter((leave: any) => leave.managerId === this.manager.id);

    // Pending visa applications
    this.pendingVisaApplications = this.allManagerVisaApplications.filter((visaApplication: any) => visaApplication.status === 'pending');
    this.sharedService.watchAllLeaves().subscribe((allLeaves: any) => {
      this.pendingLeaves = allLeaves.filter((leave: any) => leave.status.toLowerCase() === 'pending');
      this.updateChartData(this.pendingLeaves);
    })
    this.remainingSickLeaveDays = this.manager.profile.remainingSickLeaveDays;
    this.remainingAnnualLeaveDays = this.manager.profile.remainingAnnualLeaveDays;
    // Show employee operations options or their routes
    const show: any = this.sharedService.initialOperationsShow();
    this.showRouter = show[0];
    this.showOperations = show[1];
    this.routerSubscription = this.sharedService.watchRouterShow().subscribe((showRouterBoolean: boolean) => this.showRouter = showRouterBoolean);
    this.operationsSubscription = this.sharedService.watchOperationsShow().subscribe((showOperationsBoolean: boolean) => this.showOperations = showOperationsBoolean);
  }

  ngOnInit(): void {

    const notificationButtonElement = document.getElementById('notificationButton');
    this.notificationsElement = document.getElementById('notifications');
    notificationButtonElement?.addEventListener('click',() => {
      if(this.managerNotifications.length < 1) {
        this.snackbar.open('No notifications updates to see','Ok',{duration: 3000});
        return;
      }
      this.showNotifications = !this.showNotifications;
      if(this.showNotifications) {
        this.notificationsElement?.classList.remove('hide')
      } else {
        this.notificationsElement?.classList.add('hide')
      }
    })

    this.chartContainer = document.getElementById('pie-chart') as HTMLCanvasElement;
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Leaves','Pending Visa Applications'],
        datasets: [{
          backgroundColor: ['#a99494','#3f51b5'],
          data: [this.pendingLeaves.length,this.pendingVisaApplications.length]
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
    this.chart.destroy();
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Leaves','Pending Visa Applications'],
        datasets: [{
          backgroundColor: ['#a99494','#3f51b5'],
          data: [pendingLeaves.length,6]
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

  showProfile(): void {
    // this.dialog.open(ProfileComponent)
  }

  logOut(): void {
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
    this.sharedService.updateOperationsShow();
    this.router.navigate(['/manager-landing/leaves']);
  }

  showVisas(): void {
    this.sharedService.updateOperationsShow();
    this.router.navigate(['/manager-landing/visas']);
  }

  seenNotification(notificationId: any): void {
    console.log(notificationId)
    this.managerNotifications = this.managerNotifications.filter((notification: any) => notification.id != notificationId);
    console.log(this.managerNotifications);
    this.allNotifications.forEach((notification: any) => {
      if(notification.id === notificationId) {
        notification.seen = true;
        this.sharedService.set('allNotifications','local',this.allNotifications);
      }
    })
    // Hide notifications box
    if(this.managerNotifications.length < 1) {
      this.notificationsElement.classList.add('hide');
    }
  }

}
