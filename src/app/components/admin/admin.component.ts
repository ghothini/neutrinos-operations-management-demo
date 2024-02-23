import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PolicyComponent } from 'src/app/popups/policy/policy.component';
import { SharedServiceService } from 'src/app/services/shared-service.service';
import * as XLSX from 'xlsx';
import { SystemUsersComponent } from '../system-users/system-users.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  displayedColumns: string[] = ['policyName', 'category'];
  displayedLeaveColumns: string[] = ['leaveId', 'leaveType', 'leaveStartDate', 'leaveEndDate', 'status'];
  dataSource: any;
  dataSourceAcceptedStatus: any;
  excelData: any;
  policies: any;
  allLeaves: any;
  usersCount: any;
  allAcceptedLeaves: any;
  showTab: boolean = true;
  constructor(private snackbar: MatSnackBar, private sharedService: SharedServiceService,
    private dialog: MatDialog, private router: Router) {
    this.policies = this.sharedService.get('policies', 'local');
    this.allLeaves = this.sharedService.get('allLeaves', 'local');
    const systemUsers = this.sharedService.get('systemUsers', 'local');
    this.usersCount = systemUsers.length;
    if (this.allLeaves) {
      this.allLeaves = this.sharedService.get('allLeaves', 'local');
      this.allAcceptedLeaves = this.allLeaves.filter((leave: any) => leave.status.toLowerCase() === 'accepted');
      console.log(this.allAcceptedLeaves)
      this.dataSourceAcceptedStatus = this.allAcceptedLeaves
    }
    this.dataSource = this.policies

    // Listeners
    this.sharedService.watchSystemUsers().subscribe((usersCount: number) => this.usersCount = usersCount)
    this.sharedService.watchPolicies().subscribe((policies: any) => {this.dataSource = policies})
  }

  ngOnInit(): void {
    const uploadTag = document.getElementById('upload')
    uploadTag?.addEventListener('change', (e: any) => {
      var file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (event) => {
        const data = new Uint8Array(fileReader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const headers = ['id', 'email', 'password', 'fullName', 'cellphoneNo', 'dateJoinedCompany', 'gender', 'role',
          'dateOfBirth', 'homeAddress', 'manager', 'managerId','operatorId', 'remainingSickLeaveDays',
          'remainingAnnualLeaveDays', 'pendingLeaveDuration', 'approvedLeaveCount'];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: headers })
        sessionStorage.setItem('excelData', JSON.stringify(excelData));
        this.verifyExcel();
      }
    })
  }
  verifyExcel() {
    let excelData: any = sessionStorage.getItem('excelData')
    excelData = excelData ? JSON.parse(excelData) : [];
    console.log('excel', excelData);
    // Fetch all users
    const systemUsers = this.sharedService.get('systemUsers', 'local');
    if (systemUsers.length > 0) {
      excelData.forEach((item: any) => {
        const itemFound = systemUsers.find((user: any) => item.id === user.id)
        if (itemFound) {
          console.log(`Account ${itemFound.id} already exists`)
        } else {
          const id = item.id;
          delete item.id;
          const password = item.password;
          item['password'] = password.toString();
          systemUsers.push({
            "id": id,
            profile: {
              ...item,
              "operationsOperated": {
                "visaExtensions": [],
                "visaApplications": [],
                "flightsInformation": [],
                "guesthouseServices": [],
                "internationalTravels": [],
                "domesticTravels": []
              }
            }
          });
        }
      })
      this.sharedService.set('systemUsers', 'local', systemUsers);
      this.sharedService.updateUsersCount()
      this.separatedSystemUsers(systemUsers);
    } else {
      excelData.forEach((item: any) => {
        const id = item.id;
        const password = item.password;
        item['password'] = password.toString();
        delete item.id;
        systemUsers.push({
          "id": id,
          profile: {
            ...item,
            "operationsOperated": {
              "visaExtensions": [],
              "visaApplications": [],
              "flightsInformation": [],
              "guesthouseServices": [],
              "internationalTravels": [],
              "domesticTravels": []
            }
          }
        })
      })
      this.sharedService.set('systemUsers', 'local', systemUsers);
      this.sharedService.updateUsersCount()
      this.separatedSystemUsers(systemUsers);
    }
    this.snackbar.open('File uploaded successfully', 'Ok', { duration: 3000 });
  }

  separatedSystemUsers(users: any): void {
    let managers: any = [];
    let employees: any = [];
    let operators: any = [];
    users.forEach((user: any) => {
      switch (user.profile.role.toLowerCase()) {
        case 'manager':
          managers.push(user);
          break;
        case 'employee':
          employees.push(user);
          break;
        case 'operator':
          operators.push(user);
          break;
      }
    })
    this.sharedService.set('operators', 'local', operators);
    this.sharedService.set('managers', 'local', managers);
    this.sharedService.set('employees', 'local', employees);
  }

  addPolicy(): void {
    this.dialog.open(PolicyComponent);
  }

  showAdd(): void {
    this.showTab = !this.showTab;
  }

  startAdd(): void {
    this.showTab = true;
  }

  editPolicy(policy: any): void {
    // this.sharedService.set('toEditPolicyId','session',id);
    this.dialog.open(PolicyComponent,{
      data: {
        data: policy
      },
      width: '100%'
    })
  }

  showUsers(): void {
    if(this.usersCount === 0) {
      this.snackbar.open('Upload users spreadsheet');
      return;
    }
    this.dialog.open(SystemUsersComponent);
  }


  logOut(): void {
    sessionStorage.removeItem('admin')
    this.router.navigate(['/sign-in']);
  }
}
