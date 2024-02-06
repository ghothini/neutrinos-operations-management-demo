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

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' }, // redirect to `sign-in`
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'manager-landing', component: ManagerLandingComponent, children: [
      { path: 'leaves', component: LeavesComponent },
      { path: 'visas', component: VisasComponent },
    ]
  },
  {
    path: 'landing', component: LandingComponent, children: [
      { path: 'visa-extension', component: VisaExtensionComponent },
      { path: 'visa-application', component: VisaApplicationComponent },
      { path: 'flight-information', component: FlightInformationComponent },
      { path: 'guesthouse-service', component: GuesthouseServiceComponent },
      { path: 'international-travel', component: InternationalTravelComponent },
      { path: 'domestic-travel', component: DomesticTravelComponent },

    ]
  },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
