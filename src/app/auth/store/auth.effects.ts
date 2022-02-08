import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthResponseData, AuthService } from '../services/auth.service';
import * as AuthActions from '../store/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  authLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN),
      switchMap((authData: AuthActions.Login) => {
        return this.authService
          .login(authData.payload.email, authData.payload.password)
          .pipe(map(this.authSuccessHandler), catchError(this.errorHandler));
      })
    );
  });

  authSignUp = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGN_UP),
      switchMap((authData: AuthActions.SignUp) => {
        return this.authService
          .signUp(authData.payload.email, authData.payload.password)
          .pipe(map(this.authSuccessHandler), catchError(this.errorHandler));
      })
    );
  });

  private authSuccessHandler = (response: AuthResponseData) => {
    this.authService.setLogoutTimer(+response.expiresIn);

    const expireDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );
    const user = new User(
      response.localId,
      response.email,
      response.idToken,
      expireDate
    );
    localStorage.setItem('user', JSON.stringify(user));
    return new AuthActions.AuthSuccess(user);
  }

  private errorHandler(errorResponse) {

    console.error(errorResponse)
    let errorMessage: string = 'An error occurred.';
    
    if (!errorResponse.error || !errorResponse.error.error) {
      return of(new AuthActions.AuthFail(errorMessage));
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Email not found.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid password.';
        break;
    }
    return of(new AuthActions.AuthFail(errorMessage));
  }

  logout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.clear();
        })
      );
    },
    { dispatch: false }
  );

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          const user = new User(
            userData.userId,
            userData.email,
            userData._token,
            new Date(userData._expirationDate)
          );
          if (user.token) {
            return user;
          }
        }
        return null;
      }),
      tap((user) => {
        if (!user) {
          localStorage.clear();
        }
      }),
      filter((user) => user !== null),      
      map((user) => new AuthActions.AuthSuccess(user))
    );
  });
}
