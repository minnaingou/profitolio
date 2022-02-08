import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from "../store/auth.actions";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.authBaseUrl + environment.loginApi + environment.apiKey,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.authBaseUrl + environment.signUpApi + environment.apiKey,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
  }

  private autoLogoutTimeout;

  setLogoutTimer(expiresIn: number) {
    this.autoLogoutTimeout = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expiresIn * 1000);
  }

  clearLogoutTimer() {
    if (this.autoLogoutTimeout) {
      clearTimeout(this.autoLogoutTimeout);
      this.autoLogoutTimeout = null;
    }
  }
}

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}
