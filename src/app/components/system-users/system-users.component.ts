import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.scss']
})
export class SystemUsersComponent {
  displayedColumns: string[] = ['userId', 'fullName', 'gender', 'email', 'joinDate','actions'];
  dataSource: any;
  systemUsers: any;
  employees: any;
  managers: any;
  operators: any;

  constructor(private sharedService: SharedServiceService,private snackbar: MatSnackBar){
    this.systemUsers = this.sharedService.get('systemUsers', 'local');
    this.dataSource = this.systemUsers;
    this.employees = this.sharedService.get('employees','local');
    this.managers = this.sharedService.get('managers','local');
    this.operators = this.sharedService.get('operators','local')
  }

  deleteUser(_user: any): void {
    const confirmDelete = prompt('type delete to confirm');
    if(confirmDelete?.toLowerCase() === 'delete') {
  
      this.systemUsers = this.systemUsers.filter((user: any) => user.id !== _user.id)
      this.dataSource = this.systemUsers
      if(_user.profile.role.toLowerCase() === 'manager'){
        this.managers = this.managers.filter((manager: any) => manager.id != _user.id);
        this.sharedService.set('managers','local',this.managers)
      }
      if(_user.profile.role.toLowerCase() === 'operator'){
        this.operators = this.operators.filter((operator: any) => operator.id != _user.id);
        this.sharedService.set('operators','local',this.operators)
      }
      if(_user.profile.role.toLowerCase() === 'employee'){
        this.employees = this.employees.filter((employee: any) => employee.id != _user.id);
        this.sharedService.set('employees','local',this.employees)
      }
      this.sharedService.set('systemUsers','local',this.systemUsers)
      this.snackbar.open('User deleted successfully','Ok',{duration: 3000})
    } else {
      this.snackbar.open('Action cancelled','Ok',{duration: 3000})}
  }
}
