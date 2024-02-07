import { Component } from '@angular/core';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-visas',
  templateUrl: './visas.component.html',
  styleUrls: ['./visas.component.scss']
})
export class VisasComponent {
  panelOpenState = false;
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;
  allVisaApplications: any;
  allEmployees: any;
  employee: any;
  dateOfBirth: any = {
    year: '',
    month: '',
    day: ''
  }
  allVisaExtensionApplications: any;

  constructor(private sharedService: SharedServiceService){
    this.allVisaApplications = this.sharedService.get('visaApplications','local');
    this.allEmployees = this.sharedService.get('employees','local');
    this.allVisaApplications.forEach((visaApplication: any,indx: any) => {
      this.allEmployees.forEach((employee: any) => {
        if(employee.id === visaApplication.id){
          console.log(employee.profile.dateOfBirth)
          visaApplication['dateOfBirth'] = employee.profile.dateOfBirth;
           const dateOfBirth = visaApplication['dateOfBirth'].split('-');
          this.dateOfBirth.year = dateOfBirth[0].split('');
          this.dateOfBirth.month = dateOfBirth[1].split('');
          this.dateOfBirth.day = dateOfBirth[2].substring(0,2).split('');
          visaApplication['dateOfBirthArr'] = this.dateOfBirth;
        }
      })
    })
  }
}
