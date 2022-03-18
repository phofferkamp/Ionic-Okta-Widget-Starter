export const environment = {
  production: true,
  oidc: {
    clientId: '{{ YOUR OKTA CLIENT ID }}',
    issuer: 'https://{{ YOUR OKTA DOMAIN }}.okta.com/oauth2/default',
    redirectUri: window.location.origin + '/callback',
    scopes: ['openid', 'profile', 'email'],
    testing: {
      disableHttpsCheck: `false`
    },
  },
};
