import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
})
export class UserlistComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrationService.getLoggedIn().subscribe((res) => {
      console.log('Loggedin?  ', res);
      if (!res) {
        this.router.navigateByUrl('/login');
      } else {
        this.loggedIn = true;
        this.getUserList();
      }
    });
  }

  getUserList() {
    this.registrationService.phpGetAllUsers().subscribe((res) => {
      console.log(res);
    });
  }
}
