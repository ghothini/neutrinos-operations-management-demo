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
  showNotificationsIcon: boolean = false;
  operationsShowSubject = new Subject<any>()
  allLeaves: any;
  allVisaApplications: any;
  allLeavesSubject = new Subject<any>();
  allVisaApplicationsSubject = new Subject<any>();
  remainingSickLeaveDays: any = 15;
  remainingAnnualLeaveDays: any = 30;
  remainingSickLeaveDaysSubject = new Subject<any>();
  remainingAnnualLeaveDaysSubject = new Subject<any>();
  employeeAccountSubject = new Subject<any>();
  showNotificationsIconSubject = new Subject<any>();
  systemUsersCountSubject = new Subject<any>();
  policiesSubject = new Subject<any>();
  employee: any;
  managerPieData: any;
  showChangePasswrd: boolean = false;
  changePasswrdSubject = new Subject<any>();
  managerPieSubject = new Subject<any>();

  updateOperationsShow(): any {
    this.showRouter = !this.showRouter;
    this.showOperations = !this.showOperations;
    this.routerShowSubject.next(this.showRouter);
    this.operationsShowSubject.next(this.showOperations);
  }

  updateChangePasswrd(): any {
    this.changePasswrdSubject.next(this.showChangePasswrd);
  }

  updateAnnualLeaveDays(employee: any): void {
    this.remainingAnnualLeaveDays = employee.profile.remainingAnnualLeaveDays;
    this.remainingAnnualLeaveDaysSubject.next(this.remainingAnnualLeaveDays);
  }

  updateSickLeaveDays(employee: any): void {
    this.remainingSickLeaveDays = employee.profile.remainingSickLeaveDays;
    this.remainingSickLeaveDaysSubject.next(this.remainingSickLeaveDays);
  }

  updateshowNotificationsIcon(): void {
    this.showNotificationsIcon = true;
    this.showNotificationsIconSubject.next(this.showNotificationsIcon);
  }

  updateUsersCount(): void {
    const systemUsers = localStorage.getItem('systemUsers');
    const usersCount = systemUsers ? JSON.parse(systemUsers).length : 0;
    this.systemUsersCountSubject.next(usersCount);
  }

  updateAllLeaves(allLeaves: any): void {
    this.allLeaves = allLeaves;
    this.allLeavesSubject.next(this.allLeaves);
  }

  updateVisaApplictions(allVisaApplications: any): void {
    this.allVisaApplications = allVisaApplications;
    this.allVisaApplicationsSubject.next(this.allVisaApplications);
  }

  updatePolicies(): void {
    let policies = localStorage.getItem('policies');
    policies = policies ? JSON.parse(policies) : [];
    this.policiesSubject.next(policies);
  }

  watchRouterShow(): Observable<any> {
    return this.routerShowSubject.asObservable();
  }

  watchChangePasswrd(): Observable<any> {
    return this.changePasswrdSubject.asObservable();
  }

  watchNotificationIcon(): Observable<any> {
    return this.showNotificationsIconSubject.asObservable();
  }

  watchVisaApplications(): Observable<any> {
    return this.allVisaApplicationsSubject.asObservable();
  }

  watchSystemUsers(): Observable<any> {
    return this.systemUsersCountSubject.asObservable();
  }

  watchPolicies(): Observable<any> {
    return this.policiesSubject.asObservable();
  }

  // Logged In Employee Account

  updateEmployeeAccount(employee: any): void {
    this.employee = employee;
    this.employeeAccountSubject.next(this.employee);
  }

  updateManagerPieData(data: any): void {
    this.managerPieData = data;
    this.managerPieSubject.next(data);
  }

  initManagerPieData(data: any): void {
    this.managerPieData = data;
  }

  getInitManagerPieData(): void {
    return this.managerPieData;
  }

  watchEmployeeAccount(): Observable<any> {
    return this.employeeAccountSubject.asObservable();
  }

  watchManagerPieData(): Observable<any> {
    return this.managerPieSubject.asObservable();
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
    return [this.showRouter, this.showOperations];
  }

  // Storage

  set(key: string, storage: string, data: any): void {
    storage === 'session' ? sessionStorage.setItem(key, JSON.stringify(data)) : localStorage.setItem(key, JSON.stringify(data))
  }

  get(key: string, storage: string): any {
    let data;
    if (storage === 'session') {
      data = sessionStorage.getItem(key);
    } else {
      data = localStorage.getItem(key);
    }
    return data ? JSON.parse(data) : [];
  }

  constructor() { }
}
