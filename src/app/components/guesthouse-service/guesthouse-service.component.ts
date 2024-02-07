import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-guesthouse-service',
  templateUrl: './guesthouse-service.component.html',
  styleUrls: ['./guesthouse-service.component.scss']
})
export class GuesthouseServiceComponent {
  employee: any;
  allEmployees: any;
  allManagers: any;
  allGuesthouseServices: any;
  managerId: any;
  guesthouseServiceFormData: any = {
    fullName: 'Thapelo Mokotelakoena',
    email: 'thapeloghothini@gmail.com',
    phoneNo: '072 714 8449',
    passportNo: '',
    problem: '',
    otherGuesthouse: '',
    addressProblemDate: '',
    additionalInfo: ''
  }

  constructor(private location: Location, private sharedService: SharedServiceService, private snackbar: MatSnackBar
    , private router: Router) {
    this.employee = this.sharedService.get('employee', 'session');
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.allManagers = this.sharedService.get('managers', 'local');
    this.allGuesthouseServices = this.sharedService.get('guesthouseServices', 'local');
    console.log(this.allGuesthouseServices)
  }
  goBack(): void {
    this.location.back();
    this.sharedService.updateOperationsShow();
  }

  submit(): void {
    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        this.managerId = employee.profile.managerId;
      }
    })
    
    // Set company manager to form
    this.allManagers.forEach((manager: any) => {
      if (manager.id === this.managerId) {
        this.guesthouseServiceFormData['operator'] = manager.profile.operatorId;
      }
    })
    this.employee.operationsOperated.guesthouseServices.push(this.guesthouseServiceFormData);
    // Update session and local storage and visa extensions array
    this.sharedService.set('employee', 'session', this.employee);
    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        employee.operationsOperated.guesthouseServices.push(this.guesthouseServiceFormData);
        this.sharedService.set('employees', 'local', this.allEmployees);
      }
    })
    this.allGuesthouseServices.push(this.guesthouseServiceFormData);
    this.allGuesthouseServices[this.allGuesthouseServices.length - 1] = {
      ...this.allGuesthouseServices[this.allGuesthouseServices.length - 1],
      id: this.employee.id
    }
    console.log(this.allGuesthouseServices);
    this.sharedService.set('guesthouseServices', 'local', this.allGuesthouseServices);
    this.snackbar.open(`Guesthouse service was requested successfully`, 'Ok', { duration: 3000 });
    this.sharedService.updateOperationsShow();
    this.location.back();
  }

}
