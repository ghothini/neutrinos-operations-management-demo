import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  allEmployees: any;
  allManagers: any;
  allOperators: any;
  loginFormGroup: FormGroup;

  constructor(private router: Router, private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.allManagers = this.sharedService.get('managers', 'local');
    this.allOperators = this.sharedService.get('operators', 'local');
    console.log(this.allEmployees);

    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)]),
      password: new FormControl('', [Validators.required])
    })

    // const managers = [
    //   {
    //     "startWorkDay": "",
    //     "id": `manager-${new Date().getTime()}`,
    //     "profile": {
    //       email: 'kamogelo@neutrionsmanagement.com',
    //       password: '123',
    //       fullName: "Neutrinos Manager",
    //       cellphoneNo: '072 714 8449',
    //       dateJoinedCompany: '2024-02-20T22:00:00.000Z',
    //       gender: 'Male',
    //       operatorId: 'operator-1707295342729',
    //       role: 'Manager',
    //       dateOfBirth: '1996-05-27T22:00:00.000Z',
    //       homeAddress: 'Eastern Cape,121 Sandton Street',
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
    //     "id": "manager-1706750245643",
    //     "profile": {
    //       email: 'phemelo@neutrionsmanagement.com',
    //       password: '123',
    //       fullName: "Phemelo Siduki",
    //       cellphoneNo: '072 888 4564',
    //       operatorId: 'operator-1707295600409',
    //       dateJoinedCompany: '2024-02-20T22:00:00.000Z',
    //       gender: 'Male',
    //       role: 'Manager',
    //       dateOfBirth: '1996-05-27T22:00:00.000Z',
    //       homeAddress: 'Rustenburg 0202, Boitekong Ext 4',
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
    //   }]
    // this.sharedService.set('managers', 'local', managers)

    // Local Storage Operators

    // const operators = [
    //   {
    //     "startWorkDay": "",
    //     "id": `operator-1707295342729`,
    //     "profile": {
    //       email: 'motshabi@neutrionsmanagement.com',
    //       password: '123',
    //       fullName: "Neutrinos Operator",
    //       cellphoneNo: '081 564 8449',
    //       dateJoinedCompany: '2013-02-10T22:00:00.000Z',
    //       gender: 'Male',
    //       role: 'Operator',
    //       dateOfBirth: '1991-05-05T22:00:00.000Z',
    //       homeAddress: 'Rustenburg,121 Sandton Street',
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
    //     "id": `operator-1707295600409`,
    //     "profile": {
    //       email: 'thabiso@neutrionsmanagement.com',
    //       password: '123',
    //       fullName: "Neutrinos Operator",
    //       cellphoneNo: '072 564 8449',
    //       dateJoinedCompany: '2023-02-10T22:00:00.000Z',
    //       gender: 'Male',
    //       role: 'Operator',
    //       dateOfBirth: '2000-05-15T22:00:00.000Z',
    //       homeAddress: 'Randburg,121 Sandton Street',
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
    //   }]
    // this.sharedService.set('operators', 'local', operators)
  }

  submit() {
    if (this.loginFormGroup.invalid) return;
    console.log(this.loginFormGroup.value.email)
    // Get all users
    let isFound: any;
    this.allEmployees.forEach((employee: any) => {
      if (employee.profile.email === this.loginFormGroup.value.email) {
        isFound = employee;
        console.log(employee.profile.email);
        return;
      }
    })
    this.allManagers.forEach((manager: any) => {
      if (manager.profile.email === this.loginFormGroup.value.email) {
        isFound = manager;
        return;
      }
    })
    this.allOperators.forEach((operator: any) => {
      if (operator.profile.email === this.loginFormGroup.value.email) {
        isFound = operator;
        return;
      }
    })

    if (isFound) {
      if (isFound.profile.password === this.loginFormGroup.value.password) {
        if (isFound.profile.role.toLowerCase() === 'employee') {
          this.sharedService.set('employee', 'session', isFound);
          this.snackbar.open('Logged in successfully', 'Ok', { duration: 3000 });
          this.router.navigate(['/landing']);
          return;
        }
        if (isFound.profile.role.toLowerCase() === 'manager') {
          this.sharedService.set('manager', 'session', isFound);
          this.snackbar.open('Manager logged in successfully', 'Ok', { duration: 3000 });
          this.router.navigate(['/manager-landing']);
          return;
        }
        if (isFound.profile.role.toLowerCase() === 'operator') {
          this.sharedService.set('operator', 'session', isFound);
          this.snackbar.open('Operator logged in successfully', 'Ok', { duration: 3000 });
          this.router.navigate(['/operator-landing']);
          return;
        }
      } else {
        this.snackbar.open('Password does not match', 'Ok', { duration: 3000 });
        return;
      }
    } else {
      this.snackbar.open('Account does not exist', 'Ok', { duration: 3000 });
      return;
    }
  }
}
