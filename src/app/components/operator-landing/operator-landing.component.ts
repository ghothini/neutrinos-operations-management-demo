import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import { ViewOperationComponent } from '../view-operation/view-operation.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-operator-landing',
  templateUrl: './operator-landing.component.html',
  styleUrls: ['./operator-landing.component.scss']
})
export class OperatorLandingComponent implements OnInit {
  chart: any;
  allLeaves: any;
  allOperatorLeaves: any;
  operator: any;
  allVisaApplications: any;
  allVisaExtensions: any;
  allInternationalTravels: any;
  allGuesthouseServices: any;
  allDomesticTravels: any;
  allFlightsInformation: any;
  allOperatorVisaApplications: any;
  allOperatorVisaExtensions: any;
  allOperatorInternationalTravels: any;
  allOperatorGuesthouseServices: any;
  allOperatorDomesticTravels: any;
  allOperatorFlightsInformation: any;
  operatorAcceptedLeaves: any;
  operatorAcceptedVisaApplications: any;
  acceptedVisaApplications: any;
  notificationsElement: any;
  allNotifications: any;
  operatorNotifications: any;
  showNotifications: boolean = false;

  constructor(private router: Router, private sharedService: SharedServiceService,
    private dialog: MatDialog, private snackbar: MatSnackBar) {
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    this.operator = this.sharedService.get('operator', 'session');
    this.allVisaExtensions = this.sharedService.get('visaExtensionApplications', 'local');
    this.allGuesthouseServices = this.sharedService.get('guesthouseServices', 'local');
    this.allInternationalTravels = this.sharedService.get('internationalTravels', 'local');
    this.allVisaApplications = this.sharedService.get('visaApplications', 'local');
    this.allDomesticTravels = this.sharedService.get('domesticTravels', 'local');
    this.allFlightsInformation = this.sharedService.get('allFlightsInformation', 'local');
    
    // Get employee notifications
    this.allNotifications = this.sharedService.get('allNotifications', 'local');
    this.operatorNotifications = this.allNotifications.filter((notification: any) => notification.operatorId === this.operator.id && !notification.seen).reverse();
   
    // SOON
    // Only for operator
    this.allOperatorVisaApplications = this.allVisaApplications.filter((visaApplication: any) => visaApplication.operator === this.operator.id);
    this.allOperatorVisaExtensions = this.allVisaExtensions.filter((visaExtension: any) => visaExtension.operator === this.operator.id);
    this.allOperatorInternationalTravels = this.allInternationalTravels.filter((internationalTravel: any) => internationalTravel.operator === this.operator.id);
    this.allOperatorGuesthouseServices = this.allGuesthouseServices.filter((guesthouseService: any) => guesthouseService.operator === this.operator.id);
    this.allOperatorDomesticTravels = this.allDomesticTravels.filter((domesticTravel: any) => domesticTravel.operator === this.operator.id);
    this.allOperatorFlightsInformation = this.allFlightsInformation.filter((flightInformation: any) => flightInformation.operator === this.operator.id);
    this.allOperatorLeaves = this.allLeaves.filter((leave: any) => leave.operator === this.operator.id);
    this.operatorAcceptedLeaves = this.allOperatorLeaves.filter((leave: any) => leave.status === 'accepted');
    this.operatorAcceptedVisaApplications = this.allOperatorVisaApplications.filter((application: any) => application.status === 'accepted');
  }

  ngOnInit(): void {
    const chartContainer = document.getElementById('pie-chart') as HTMLCanvasElement;
    this.chart = new Chart(chartContainer, {
      type: 'pie',
      data: {
        labels: ['All Leaves', 'Visa Applications', 'Visa Extension Applications',
          'International Travel Applications', 'Guesthouse Service Requests', 'Domestic Travel Requests',
          'Flights Information Applications'],
        datasets: [{
          backgroundColor: ['#a99494', '#3f51b5', '#5489b0', '#002948', '#37a586', '#7a7aa4', '#7f2222'],
          data: [this.allLeaves.length, this.allVisaApplications.length, this.allVisaExtensions.length,
          this.allInternationalTravels.length, this.allGuesthouseServices.length,
          this.allDomesticTravels.length, this.allFlightsInformation.length]
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
    const notificationButtonElement = document.getElementById('notificationButton');
    this.notificationsElement = document.getElementById('notifications');
    notificationButtonElement?.addEventListener('click',() => {
      if(this.operatorNotifications.length < 1) {
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
  }

  logOut(): void {
    sessionStorage.removeItem('operator');
    this.router.navigate(['/sign-in']);
  }

  showOperation(operation: any): void {
    console.log(operation)
    this.dialog.open(ViewOperationComponent, {
      data: {
        _operation: operation
      }
    });
  }

  seenNotification(notificationId: any): void {
    this.operatorNotifications = this.operatorNotifications.filter((notification: any) => notification.id != notificationId);
    this.allNotifications.forEach((notification: any) => {
      if(notification.id === notificationId) {
        notification.seen = true;
        this.sharedService.set('allNotifications','local',this.allNotifications);
      }
    })
    this.snackbar.open('Notification deleted successfully','Ok',{duration: 3000});
    // Hide notifications box
    if(this.operatorNotifications.length < 1) {
      this.notificationsElement.classList.add('hide');
    }
  }
  switchAcc(): void {
    this.snackbar.open('Successfully switched account','Ok',{duration: 3000});

    this.sharedService.set('temp','session',{
      ...this.operator,
      allLeaves: this.allLeaves,
      allVisaApplications: this.allVisaApplications
    });
    this.router.navigate(['/operator-to-manager-landing']);
  }
}
