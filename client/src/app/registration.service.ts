import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  submitNodeRegistration(data: any): Observable<any> {
    return this.http.post('http://localhost:3001/auth/register', data);
  }

  submitPhpRegistration(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/users', data);
  }
}
