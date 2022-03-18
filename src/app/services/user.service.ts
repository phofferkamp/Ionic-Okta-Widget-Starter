import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    ) { 
  }

  getUserInfo() {
    const headers = {
			Authorization: 'Bearer ' + this.oktaAuth.getAccessToken(),
		};

    return this.http.get(environment.oidc.issuer
			+ '/v1/userinfo', {headers: headers});
  }

  async signOut() {
    await this.router.navigate(['/']);

    await this.oktaAuth.revokeAccessToken();

		await this.oktaAuth.closeSession();

		await window.location.reload();
	}
}
