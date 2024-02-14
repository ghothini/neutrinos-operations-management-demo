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
  admin: any;
  loginFormGroup: FormGroup;

  constructor(private router: Router, private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.allManagers = this.sharedService.get('managers', 'local');
    this.allOperators = this.sharedService.get('operators', 'local');
    this.admin = this.sharedService.get('admin', 'local');
    console.log(this.allEmployees);

    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)]),
      password: new FormControl('', [Validators.required])
    })

    // const admin = [
    //   {
    //     "id": `admin-00000000`,
    //     "profile": {
    //       email: 'admin@gmail.com',
    //       password: '123',
    //       fullName: "Administrator",
    //       cellphoneNo: '0754455656',
    //       dateJoinedCompany: '2023-03-21T22:00:00.000Z',
    //       gender: 'Female',
    //       operatorId: 'operator-1707295342729',
    //       role: 'Admin',
    //       dateOfBirth: '2005-11-20T22:00:00.000Z',
    //       homeAddress: 'Cape Town,121 Sandton Street',
    //       remainingSickLeaveDays: 15,
    //       remainingAnnualLeaveDays: 30,
    //       approvedLeaveCount: 0,
    //       pendingLeaveDuration: 'None'
    //     }
    //   }
    // ]
    // this.sharedService.set('admin', 'local', admin)
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
    this.admin.forEach((admin: any) => {
      if (admin.profile.email === this.loginFormGroup.value.email) {
        isFound = admin;
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
        if (isFound.profile.role.toLowerCase() === 'admin') {
          this.sharedService.set('admin', 'session', isFound);
          this.snackbar.open('Admin logged in successfully', 'Ok', { duration: 3000 });
          this.router.navigate(['/admin']);
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
