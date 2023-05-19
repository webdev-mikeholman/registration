import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}
  phpURL: string = 'http://localhost:8000';
  nodeURL: string = 'http://localhost:3001';

  submitNodeRegistration(data: any): Observable<any> {
    return this.http.post(`${this.nodeURL}/auth/register1`, data);
  }

  submitPhpRegistration(data: any): Observable<any> {
    return this.http.post(`${this.phpURL}/users`, data);
  }

  nodeLogin(data: any): Observable<any> {
    return this.http.post(`${this.nodeURL}/auth/login`, data);
  }

  phpLogin(data: any): Observable<any> {
    return this.http.post(`${this.phpURL}/login`, data);
  }
}
