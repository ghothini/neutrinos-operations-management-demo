import { Location } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedServiceService } from 'src/app/services/shared-service.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent {
  allPolicies: any;
  isUpdating: boolean = false;
  categories: string[] = ['Ethical Behavior'];
  formLinks: string[] = ['www.google.com/fill-ethical-policy'];
  policyForm: FormGroup;
  constructor(private location: Location, private dialogRef: MatDialogRef<PolicyComponent>,
    private sharedService: SharedServiceService, private snackbar: MatSnackBar,@Inject(MAT_DIALOG_DATA) public data: any){
      if(data){
        this.isUpdating = true;
        this.policyForm = new FormGroup({
          title: new FormControl(`${data.data.title}`,[Validators.required]),
          content: new FormControl(`${data.data.content}`,[Validators.required]),
          procedure: new FormControl(`${data.data.procedure}`,[Validators.required]),
          category: new FormControl(`${data.data.category}`,[Validators.required]),
          formLink: new FormControl(`${data.data.formLink}`,[Validators.required]),
          id: new FormControl(`${data.data.id}`,[Validators.required]),
        })
      } else {
        this.policyForm = new FormGroup({
          title: new FormControl('',[Validators.required]),
          content: new FormControl('',[Validators.required]),
          procedure: new FormControl('',[Validators.required]),
          category: new FormControl('',[Validators.required]),
          formLink: new FormControl('',[Validators.required]),
          id: new FormControl(`policy-${new Date().getTime()}`,[Validators.required]),
        })
      }
      this.allPolicies = this.sharedService.get('policies', 'local');
    }
  goBack() {
    this.dialogRef.close()
  }

  submit(){
    if(this.policyForm.invalid) return;
    this.allPolicies.push(this.policyForm.value)
    this.sharedService.set('policies','local',this.allPolicies);
    this.snackbar.open('Policy added successfully','Ok',{duration: 3000});
    this.dialogRef.close();
  }

  update(): void {
    const allPolicies = this.sharedService.get('policies', 'local');
    allPolicies.forEach((policy: any,indx: number) => {
      if (policy.id === this.policyForm.value.id) {
        allPolicies[indx] = this.policyForm.value;
        console.log(policy)
      }
    })
    this.sharedService.set('policies', 'local', allPolicies);
    this.snackbar.open('Policy updated successfully','Ok',{duration: 3000});
    this.dialogRef.close();
    return;
  }
}

