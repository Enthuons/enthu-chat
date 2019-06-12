import auth0 from 'auth0-js';
import history from '../history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'enthu-chat.eu.auth0.com',
    clientID: 'tagESJE1T9c73CvUeP7WlSFajyOaBgmd',
    redirectUri: 'http://localhost:3000/callback',
    logoutUrl:'https://localhost:3000/logout',
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  accessToken;
  idToken;
  expiresAt;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);    
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/verifymail',err);
        // console.log(err);
        // alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;
    // navigate to the home route
    history.replace('/');
  }

  getProfile(cb) {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }
   
  renewSession() {
   this.auth0.checkSession({}, (err, authResult) => { 
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
      //   this.logout(); 
      //   console.log(err);
      //  alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        localStorage.removeItem('isLoggedIn');
        history.replace('/');
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    localStorage.removeItem('isLoggedIn');
  //  window.location='https://enthu-chat.eu/v2/logout';
  //  window.location= 'https://enthu-chat.eu.auth0.com/v2/logout' ;
    window.location= 'https://enthu-chat.eu.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost%3A3000%2Flogout&client_id=tagESJE1T9c73CvUeP7WlSFajyOaBgmd' ;
  }
  
  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

}