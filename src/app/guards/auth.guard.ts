import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedServiceService } from '../services/shared-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private sharedService: SharedServiceService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = this.sharedService.get('employee', 'session');
    if (isLoggedIn.profile || isLoggedIn.profile.role.toLowerCase() === 'employee') {
      return true;
    }
    this.router.navigate(['/sign-in']);
    return false;
  }

}
