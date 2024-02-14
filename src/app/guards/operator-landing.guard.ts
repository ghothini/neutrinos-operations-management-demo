import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedServiceService } from '../services/shared-service.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OperatorLandingGuard implements CanActivate {
  constructor(private sharedService: SharedServiceService,private location: Location){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isOperator = this.sharedService.get('temp', 'session');
      console.log(isOperator)
      if (isOperator.profile.role.toLowerCase() === 'operator') {
        return true;
      }
      this.location.back()
      return false;
  }
}
