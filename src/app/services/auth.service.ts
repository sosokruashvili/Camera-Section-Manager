import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private username = 'user';
  private password = '1qazXSW@';

  constructor(private http: HttpClient) {}

  makeLogin() {
    return this.login({ username: this.username, password: this.password });
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    console.log('Sending login request with:', credentials);
  
    return this.http.post<{ access_token: string }>('https://eva-lpr.ge/api/auth/login', credentials).pipe(
      tap({
        next: response => {
          console.log('Login response:', response);
          if (response && response.access_token) {
            this.setToken(response.access_token);
            console.log('Token stored:', response.access_token);
          } else {
            console.error('No access_token found in response:', response);
          }
        },
        error: error => console.error('Login request failed:', error)
      })
    );
  }
  

  getToken(): string | null {
    return localStorage.getItem('access_token'); 
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

}
