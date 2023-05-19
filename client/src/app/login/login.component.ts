import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hidden: boolean = true;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(private registrationService: RegistrationService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.registrationService.nodeLogin(this.loginForm.value).subscribe(
        (res) => {
          console.log(res);
          if (res.success) {
            alert('Login successful');
          } else if (!res.success) {
            this.registrationService
              .phpLogin(this.loginForm.value)
              .subscribe((res) => {
                if (res.success) {
                  alert('Login successful');
                }
              });
          } else {
            alert('Login failed');
          }
        },
        (err) => {
          if (err.status === 401) {
            this.registrationService
              .phpLogin(this.loginForm.value)
              .subscribe((res) => {
                if (res && res.success) {
                  alert('Login successful');
                } else {
                  alert('Login failed');
                }
              });
          } else {
            alert('Login failed');
          }
        }
      );
    }
  }
}
