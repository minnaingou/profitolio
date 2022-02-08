import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isSignUp: boolean = false;
  loading: boolean = false;
  errorMessage: string;

  authStoreSubscription: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.authForm = this.getAuthForm();

    this.authStoreSubscription = this.store
      .select('auth')
      .subscribe((state) => {
        this.loading = state.loading;
        this.errorMessage = state.error;
        if (state.user) {
          this.router.navigate(['/portfolio']);
        }
        if (this.errorMessage) {
          this.dialog.open(DialogComponent, {
            data: {
              title: 'Error',
              content: this.errorMessage,
              closeLabel: 'OK',
              onCloseHandler: () => {
                this.errorMessage = null;
              },
            },
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.authStoreSubscription.unsubscribe();
  }

  switchMode() {
    this.isSignUp = !this.isSignUp;
  }

  onAuth() {
    if (this.authForm.valid) {
      const email = this.authForm.get('email').value;
      const password = this.authForm.get('password').value;
      if (this.isSignUp) {
        this.store.dispatch(new AuthActions.SignUp({ email, password }));
      } else {
        this.store.dispatch(new AuthActions.Login({ email, password }));
      }
    }
  }

  private getAuthForm() {
    return new FormGroup({
      email: new FormControl("demo@user.com", [Validators.required, Validators.email]),
      password: new FormControl("demouser", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
