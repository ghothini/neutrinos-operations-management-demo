import { Component, OnInit } from '@angular/core';
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
  pendingLeaves: any;
  manager: any;
  remainingSickLeaveDays: any;
  remainingAnnualLeaveDays: any;
  chart: any;
  operationsSubscription: Subscription;
  routerSubscription: Subscription;
  chartContainer: any;

  constructor(private sharedService: SharedServiceService, private router: Router) {
    this.manager = this.sharedService.get('manager', 'session');
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.sharedService.watchAllLeaves().subscribe((allLeaves: any) => {
      this.pendingLeaves = allLeaves.filter((leave: any) => leave.status.toLowerCase() === 'pending');
      this.updateChartData(this.pendingLeaves);
    })
    this.pendingLeaves = this.allLeaves.filter((leave: any) => leave.status.toLowerCase() === 'pending')
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
    this.chartContainer = document.getElementById('pie-chart') as HTMLCanvasElement;
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Leaves','Pending Visa Applications'],
        datasets: [{
          backgroundColor: ['#a99494','#3f51b5'],
          data: [this.pendingLeaves.length,6]
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
    // this.chart.defaults.scale.gridLines.display = false;
    console.log(this.chart)
  }

  updateChartData(pendingLeaves: any): void {
    this.chart.destroy();
    this.chart = new Chart(this.chartContainer, {
      type: 'pie',
      data: {
        labels: ['Pending Pending','Pending Visa Applications'],
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

}
