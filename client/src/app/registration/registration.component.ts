import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchPassword } from '../matchPassword.validator';
import { RegistrationService } from '../registration.service';
import { Router } from '@angular/router';
import { OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  hiddenPassword: boolean = true;
  hiddenConfirmPassword: boolean = true;
  formFields: Array<any> = [];
  hasSubmitted: boolean = false;
  formFieldErrors: Array<any> = [];

  registerForm: FormGroup;

  // Get first form input field
  @ViewChild('firstItem') firstItem!: ElementRef<HTMLInputElement>;

  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {
    // Set form validation
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        firstName: new FormControl(null, [Validators.required]),
        lastName: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]),
      },
      {
        validators: matchPassword,
      }
    );
  }

  ngOnInit(): void {
    this.registrationService.setLoggedIn(false);
    // Get form fields
    this.registrationService.getFormFields().subscribe((data) => {
      data.forEach((element: any) => {
        if (element.formPages.indexOf('register') !== -1) {
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

  // Return user to login form
  cancel = () => {
    this.resetForm();
    this.router.navigateByUrl('/login');
  };

  // Clear form fields
  resetForm = () => {
    this.registerForm.reset();
  };

  // Show and display errors
  showErrors = () => {
    const errorMessages = {
      required: 'is Required',
      email: 'is invalid',
      minlength: 'Length must be greater than 6 characters',
      maxlength: 'Length must be less than 20 characters',
      mismatched: 'Passwords do not match',
    };

    const controls = this.registerForm.controls;
    const mismatchedPasswords = this.registerForm.errors;

    for (var i in controls) {
      if (controls[i].errors !== null) {
        try {
          if (controls[i].errors!['required']) {
            this.formFieldErrors.push(
              `${i.toUpperCase()} ${errorMessages['required']}`
            );
          }
          if (controls[i].errors!['email']) {
            this.formFieldErrors.push(
              `${i.toUpperCase()} ${errorMessages['email']}`
            );
          }
          if (controls[i].errors!['minlength']) {
            this.formFieldErrors.push(
              `${i.toUpperCase()} ${errorMessages['minlength']}`
            );
          }
          if (controls[i].errors!['maxlength']) {
            this.formFieldErrors.push(
              `${i.toUpperCase()} ${errorMessages['maxlength']}`
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    if (mismatchedPasswords) {
      this.formFieldErrors.push(errorMessages['mismatched']);
    }
    console.log(this.formFieldErrors);
  };

  onSubmit = async () => {
    this.hasSubmitted = true;
    this.formFieldErrors = [];
    this.showErrors();
    if (this.registerForm.valid) {
      delete this.registerForm.value.confirmPassword;
      Promise.all([this.submitNodeRegistration, this.submitPHPRegistration])
        .then(() => {
          this.resetForm();
          alert('User registered successfully');
        })
        .catch((err) => {
          console.log(err);
          alert('Registration failed');
        });
    }
  };

  submitNodeRegistration = () => {
    return new Promise((resolve, reject) => {
      this.registrationService
        .submitNodeRegistration(this.registerForm.value)
        .subscribe(
          (res) => {
            console.log(res);
            if (res.success) {
              resolve(true);
            } else {
              reject(true);
            }
          },
          (err) => {
            console.log(err);
            reject(true);
          }
        );
    });
  };

  submitPHPRegistration = () => {
    return new Promise((resolve, reject) => {
      this.registrationService
        .submitNodeRegistration(this.registerForm.value)
        .subscribe(
          (res) => {
            console.log(res);
            if (res.success) {
              resolve(true);
            } else {
              reject(true);
            }
          },
          (err) => {
            console.log(err);
            reject(true);
          }
        );
    });
  };
}
