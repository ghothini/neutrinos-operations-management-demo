import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  employee: any;
  createPassword: FormGroup;
  allEmployees: any;
  showMainContainer: boolean = true;

  constructor(private sharedService: SharedServiceService, private snackbar: MatSnackBar) {
    this.employee = this.sharedService.get('employee', 'session');
    this.allEmployees = this.sharedService.get('employees', 'local');
    this.createPassword = new FormGroup({
      defaultPassword: new FormControl(`${this.employee.profile.password}`),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    })
  }

  submit(): void {
    if (this.createPassword.invalid) return;
    if (this.createPassword.value.newPassword != this.createPassword.value.confirmPassword) {
      this.snackbar.open('Passwords do not match', 'Ok', { duration: 3000 });
      return;
    }


    this.allEmployees.forEach((employee: any) => {
      if (employee.id === this.employee.id) {
        employee.profile.password = this.createPassword.value.newPassword;
        this.sharedService.set('employees', 'local', this.allEmployees);
        this.sharedService.set('employee', 'session', employee);
        this.snackbar.open('Password changed successfully', 'Ok', { duration: 3000 });
        this.sharedService.updateChangePasswrd();
      }
    })
  }

  remindLater(): void {
    this.showMainContainer = false;
    setInterval(() => {
      this.showMainContainer = true;
    },120000);
  }
}
