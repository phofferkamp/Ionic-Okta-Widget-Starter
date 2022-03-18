import { Inject, Injectable, NgModule } from '@angular/core';
import { CanActivate, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedAuthGuard implements CanActivate {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  async canActivate() {
      return (!(await this.oktaAuth.isAuthenticated()));
  }
}

const routes: Routes = [
  { 
    path: 'login', 
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule), canActivate: [ NotLoggedAuthGuard ] 
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [ OktaAuthGuard ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
