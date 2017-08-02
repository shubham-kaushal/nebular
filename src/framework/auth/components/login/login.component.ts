/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NbUser } from '../../models/user';
import { NbAuthService, NbAuthResult } from '../../services/auth.service';
import { NbTokenService } from '../../services/token.service';

@Component({
  selector: 'nb-login',
  styleUrls: ['./login.component.scss'],
  template: `
    <h2>Please sign in</h2>
    <form (ngSubmit)="login('email')" #loginForm="ngForm" autocomplete="nope">

      <div *ngIf="errors && errors.length > 0 && !submitted" class="alert alert-danger" role="alert">
        <div><strong>Oh snap!</strong></div>
        <div *ngFor="let error of errors">{{ error }}</div>
      </div>
      <div *ngIf="messages && messages.length > 0 && !submitted" class="alert alert-success" role="alert">
        <div><strong>Hooray!</strong></div>
        <div *ngFor="let message of messages">{{ message }}</div>
      </div>

      <div class="form-group row">
        <label for="input-email" class="sr-only">Email address</label>
        <input name="email" [(ngModel)]="user.email" type="email" id="input-email"
               class="form-control form-control-lg first" placeholder="Email address"
               [required]="getConfigValue('email', 'validation.email.required')">
      </div>

      <div class="form-group row">
        <label for="input-password" class="sr-only">Password</label>
        <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
          class="form-control form-control-lg last" placeholder="Password"
               [required]="getConfigValue('email', 'validation.password.required')"
               [minlength]="getConfigValue('email', 'validation.password.minLength')"
               [maxlength]="getConfigValue('email', 'validation.password.maxLength')">
      </div>

      <div class="checkbox">
        <label *ngIf="getConfigValue('email', 'login.rememberMe')">
          <input name="rememberMe" [(ngModel)]="user.rememberMe" type="checkbox" value="remember-me"> Remember me
        </label>
        <a routerLink="../request-password">Forgot Password</a>
      </div>
      <button [disabled]="submitted || !loginForm.form.valid"
        class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>

    <div class="links">
      Don't have an account? <a routerLink="../register">Register</a>
    </div>
  `,
})
export class NbLoginComponent {

  redirectDelay: number = 1500;
  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: NbUser = new NbUser();

  constructor(protected service: NbAuthService,
              protected router: Router) {
  }

  login(provider: string): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service.authenticate(provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(provider: string, key: string): any {
    return this.service.getProvider(provider).getConfigValue(key);
  }
}
