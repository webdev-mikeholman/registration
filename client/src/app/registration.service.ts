import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}
  phpURL: string = 'http://localhost:8000';
  nodeURL: string = 'http://localhost:3001';
  token: string = '';
  loggedIn: Subject<boolean> = new ReplaySubject();

  getFormFields(): Observable<any> {
    return this.http.get(`${this.nodeURL}/formFields/fields`);
  }

  submitNodeRegistration(data: any): Observable<any> {
    return this.http.post(`${this.nodeURL}/auth/register`, data);
  }

  submitPhpRegistration(data: any): Observable<any> {
    return this.http.post(`${this.phpURL}/users`, data);
  }

  phpLogin(data: any): Observable<any> {
    return this.http.post(`${this.phpURL}/login`, data);
  }

  phpGetValidateToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.phpURL}/validate`, { headers: headers });
  }

  phpGetAllUsers(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`${this.phpURL}/allUsers`, { headers: headers });
  }

  setToken(data: string) {
    this.token = data;
  }

  setLoggedIn(data: boolean) {
    this.loggedIn.next(data);
  }

  getLoggedIn() {
    return this.loggedIn;
  }
}
