import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';
import { OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  hidden: boolean = true;
  formFields: Array<any> = [];
  submitted: boolean = false;
  formFieldErrors: Array<any> = [];

  // Grab first form input field
  @ViewChild('firstItem') firstItem!: ElementRef<HTMLInputElement>;

  // Set form validators
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationService.setLoggedIn(false);
    // Get form fields
    this.registrationService.getFormFields().subscribe((data) => {
      data.forEach((element: any) => {
        if (element.formPages.indexOf('login') !== -1) {
          this.formFields.push(element);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    // Focus on first form input field
    setTimeout(() => {
      this.firstItem.nativeElement.focus();
    }, 1000);
  }

  // Show get and display errors
  showErrors() {
    const errorMessages = {
      required: 'is Required',
      email: 'is invalid',
    };
    const controls = this.loginForm.controls;
    for (var i in controls) {
      if (controls[i].errors !== null) {
        try {
          if (controls[i].errors!['required']) {
            i.toLowerCase() === 'email' ? (i = 'username') : i;
            this.formFieldErrors.push(
              `${i.toUpperCase()} ${errorMessages['required']}`
            );
          }
          if (controls[i].errors!['email']) {
            i.toLowerCase() === 'email' ? (i = 'username') : i;
            this.formFieldErrors.push(
              `${i.toUpperCase()} ${errorMessages['email']}`
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  // Send data to node and php
  onSubmit() {
    this.submitted = true;
    this.formFieldErrors = [];
    this.showErrors();
    if (this.loginForm.valid) {
      this.registrationService
        .phpLogin(this.loginForm.value)
        .subscribe((res) => {
          if (res && res.Token) {
            this.registrationService.setLoggedIn(true);
            this.registrationService.setToken(res.Token);
            this.router.navigateByUrl('/users');
          } else {
            alert('Login failed');
          }
        });
    }
  }
}
