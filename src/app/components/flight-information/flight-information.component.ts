import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-flight-information',
  templateUrl: './flight-information.component.html',
  styleUrls: ['./flight-information.component.scss']
})
export class FlightInformationComponent {
  employee: any;
  allEmployees: any;
  allFlightsInformation: any;
  flightInformationData: any = {
    fullName: 'Thapelo Mokotelakoena',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    airline: '',
    airport: '',
    ticketNo: '',
    pickupDate: '',
    arrivalTime: '',
    whatsappNo: ''
  }

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
    this.employee = this.sharedService.get('employee', 'session');
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.allFlightsInformation = this.sharedService.get('allFlightsInformation', 'local');
    console.log(this.allFlightsInformation)
  }
  goBack(): void {
    this.location.back();
    this.sharedService.updateOperationsShow();
  }
  submit(): void {
    this.employee.operationsOperated.flightsInformation.push(this.flightInformationData);
    // Update session and local storage and visa extensions array
    this.sharedService.set('employee', 'session', this.employee);
    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        employee.operationsOperated.flightsInformation.push(this.flightInformationData);
        this.sharedService.set('employees', 'local', this.allEmployees);
      }
    })
    this.allFlightsInformation.push(this.flightInformationData);
    this.allFlightsInformation[this.allFlightsInformation.length - 1] = {
      ...this.allFlightsInformation[this.allFlightsInformation.length - 1],
      id: this.employee.id
    }
    console.log(this.allFlightsInformation);
    this.sharedService.set('allFlightsInformation', 'local', this.allFlightsInformation);
    this.snackbar.open(`Flight transport was requested successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }

}
