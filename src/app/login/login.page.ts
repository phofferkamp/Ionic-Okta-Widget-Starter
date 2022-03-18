import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';

import * as OktaSignIn from '@okta/okta-signin-widget';

import { Http, HttpOptions, HttpHeaders } from '@capacitor-community/http';

import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

const DEFAULT_ORIGINAL_URI = window.location.origin;

@Component({
  selector: 'app-home',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private userService: UserService,
    ) {

    oktaAuth.options.httpRequestClient = async function(method, url, args) {
      const { headers, data } = args;
      let result = data;

      const dataStringififed = JSON.stringify(data);
      if (dataStringififed && dataStringififed.indexOf('"') == 0) {
        const params = dataStringififed.replace(/^\"+|\"+$/g, '').split('&');
        if (params.length > 0) {
          result = {};
          params.forEach(function(pair) {
            const keyvalue = pair.split('=');
            result[keyvalue[0]] = decodeURIComponent(keyvalue[1] || '');
          });
        }
      }

      const options: HttpOptions = {
        method: method,
        url: url,
        headers: headers as HttpHeaders,
        data: result
      };
      const ret = await Http.request(options);

      if (url.includes('/authn') && ret.status != 200) {
        alert('Authentication failed. Please try again.');
        window.location.reload();
      }

      const responseMsg = {
        responseText: ret.data,
        status: ret.status
      };
      return Promise.resolve(responseMsg);
    };

    this.oktaSignIn = new OktaSignIn({
      baseUrl: environment.oidc.issuer.split('/oauth2')[0],
      clientId: environment.oidc.clientId,
      redirectUri: environment.oidc.redirectUri,
      authClient: oktaAuth,
      useInteractionCodeFlow: false,
    });
  }

  ngOnInit() {
    const originalUri = this.oktaAuth.getOriginalUri();
    if (!originalUri || originalUri === DEFAULT_ORIGINAL_URI) {
      this.oktaAuth.setOriginalUri('/');
    }
    
    this.oktaSignIn.showSignInToGetTokens({
      el: '#sign-in-widget',
      scopes: environment.oidc.scopes
    }).then((tokens: Tokens) => {
      this.oktaSignIn.remove();
      this.oktaSignIn = null;

      this.oktaAuth.handleLoginRedirect(tokens);
    }).catch((err: any) => {
      throw err;
    });
  }

  ionViewDidEnter() {
    if (!this.oktaSignIn) {
      this.userService.signOut();
    }
  }

  ngOnDestroy() {
    this.oktaSignIn.remove();
    this.oktaSignIn = null;
  }
}
