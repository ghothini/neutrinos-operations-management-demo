import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LandingComponent } from './components/landing/landing.component';
import { VisaExtensionComponent } from './components/visa-extension/visa-extension.component';
import { FlightInformationComponent } from './components/flight-information/flight-information.component';
import { GuesthouseServiceComponent } from './components/guesthouse-service/guesthouse-service.component';
import { InternationalTravelComponent } from './components/international-travel/international-travel.component';
import { DomesticTravelComponent } from './components/domestic-travel/domestic-travel.component';
import { VisaApplicationComponent } from './components/visa-application/visa-application.component';
import { ManagerLandingComponent } from './components/manager-landing/manager-landing.component';
import { LeavesComponent } from './components/leaves/leaves.component';
import { VisasComponent } from './components/visas/visas.component';
import { OperatorLandingComponent } from './components/operator-landing/operator-landing.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { ManagerGuard } from './guards/manager.guard';
import { AuthGuard } from './guards/auth.guard';
import { OperatorGuard } from './guards/operator.guard';
import { ManagerlandingGuard } from './guards/managerlanding.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { OperatorLandingGuard } from './guards/operator-landing.guard';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' }, // redirect to `sign-in`
  { path: 'sign-in', component: SignInComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  {
    path: 'manager-landing', component: ManagerLandingComponent, canActivate: [ManagerGuard], children: [
      { path: 'leaves', component: LeavesComponent },
      { path: 'visas', component: VisasComponent },
    ]
  },
  {
    path: 'landing', component: LandingComponent, canActivate: [AuthGuard], children: [
      { path: 'visa-extension', component: VisaExtensionComponent },
      { path: 'visa-application', component: VisaApplicationComponent },
      { path: 'flight-information', component: FlightInformationComponent },
      { path: 'guesthouse-service', component: GuesthouseServiceComponent },
      { path: 'international-travel', component: InternationalTravelComponent },
      { path: 'domestic-travel', component: DomesticTravelComponent },

    ]
  },
  {
    path: 'manager-employee-landing', component: LandingComponent, canActivate: [ManagerlandingGuard], children: [
      { path: 'visa-extension', component: VisaExtensionComponent },
      { path: 'visa-application', component: VisaApplicationComponent },
      { path: 'flight-information', component: FlightInformationComponent },
      { path: 'guesthouse-service', component: GuesthouseServiceComponent },
      { path: 'international-travel', component: InternationalTravelComponent },
      { path: 'domestic-travel', component: DomesticTravelComponent },

    ]
  },
  { path: 'operator-to-manager-landing', component: ManagerLandingComponent, canActivate: [OperatorLandingGuard] },
  { path: 'operator-landing', component: OperatorLandingComponent, canActivate: [OperatorGuard] },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
