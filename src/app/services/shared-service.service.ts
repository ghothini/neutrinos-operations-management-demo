import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {
  // Methods for showing employee operations options or their routes
  showRouter: boolean = false;
  showOperations: boolean = true;
  routerShowSubject = new Subject<any>()
  operationsShowSubject = new Subject<any>()
  allLeaves: any;
  allLeavesSubject = new Subject<any>();
  remainingSickLeaveDays: any;
  remainingAnnualLeaveDays: any;
  remainingSickLeaveDaysSubject = new Subject<any>();
  remainingAnnualLeaveDaysSubject = new Subject<any>();
  employeeAccountSubject = new Subject<any>();
  employee: any;

  updateOperationsShow(): any {
    this.showRouter = !this.showRouter;
    this.showOperations = !this.showOperations;
    this.routerShowSubject.next(this.showRouter);
    this.operationsShowSubject.next(this.showOperations);
  }

  updateAnnualLeaveDays(employee: any): void {
    this.remainingAnnualLeaveDays = employee.profile.remainingAnnualLeaveDays;
    this.remainingAnnualLeaveDaysSubject.next(this.remainingAnnualLeaveDays);
  }

  updateSickLeaveDays(employee: any): void {
    this.remainingSickLeaveDays = employee.profile.remainingSickLeaveDays;
    this.remainingSickLeaveDaysSubject.next(this.remainingSickLeaveDays);
  }

  updateAllLeaves(allLeaves: any): void {
    this.allLeaves = allLeaves;
    this.allLeavesSubject.next(this.allLeaves);
  }

  watchRouterShow(): Observable<any> {
    return this.routerShowSubject.asObservable();
  }

  // Logged In Employee Account

  updateEmployeeAccount(employee: any): void {
    this.employee = employee;
    this.employeeAccountSubject.next(this.employee);
  }

  watchEmployeeAccount(): Observable<any> {
    return this.employeeAccountSubject.asObservable();
  }

  watchAnnualLeaveDays(): Observable<any> {
    return this.remainingAnnualLeaveDaysSubject.asObservable();
  }

  watchSickLeaveDays(): Observable<any> {
    return this.remainingSickLeaveDaysSubject.asObservable();
  }

  watchAllLeaves(): Observable<any> {
    // console.log(this.allLeavesSubject)
    return this.allLeavesSubject.asObservable();
  }

  watchOperationsShow(): Observable<any> {
    return this.operationsShowSubject.asObservable();
  }

  initialOperationsShow(): any {
    return [this.showRouter,this.showOperations];
  }

  // Storage

  set(key: string, storage: string,data: any): void {
    storage === 'session' ? sessionStorage.setItem(key,JSON.stringify(data)) : localStorage.setItem(key,JSON.stringify(data))
  }

  get(key: string, storage: string): any {
    let data;
    if(storage === 'session'){
      data = sessionStorage.getItem(key);
    } else {
      data = localStorage.getItem(key);
    }
    return data ? JSON.parse(data) : [];
  }

  constructor() { }
}
