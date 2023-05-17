import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchPassword } from '../matchPassword.validator';
import { RegistrationService } from '../registration.service';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  hiddenPassword: boolean = true;
  hiddenConfirmPassword: boolean = true;
  nodeChosen: boolean = false;
  phpChosen: boolean = false;

  registerForm: FormGroup;

  constructor(private registrationService: RegistrationService) {
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

  NodeChosen = () => {
    this.nodeChosen = true;
    this.phpChosen = false;
  };

  PhpChosen = () => {
    this.phpChosen = true;
    this.nodeChosen = false;
  };

  onSubmit = () => {
    if (this.registerForm.valid) {
      delete this.registerForm.value.confirmPassword;
      if (this.nodeChosen) {
        this.registrationService
          .submitNodeRegistration(this.registerForm.value)
          .subscribe(
            (res) => {
              console.log(res);
              if (res.success) {
                alert('User registered successfully');
              }
            },
            (err) => {
              console.log(err);
              alert('Registration failed');
            }
          );
      } else if (this.phpChosen) {
        this.registrationService
          .submitPhpRegistration(this.registerForm.value)
          .subscribe(
            (res) => {
              console.log(res);
              if (res.success) {
                alert('User registered successfully');
              }
            },
            (err) => {
              console.log(err);
              alert('Registration failed');
            }
          );
      }
    }
  };
}
