import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SectionService {
  token: string | null = null;
  private apiUrl = 'https://eva-lpr.ge/api/sections';

  constructor(private authService: AuthService, private http: HttpClient) { }

  getSections(): Observable<any[]> {
    this.token = this.authService.getToken();
    if (!this.token) {
      alert('No token found, logging in...');
      return this.authService.makeLogin().pipe(
        tap(response => this.token = response.access_token),
        switchMap(() => this.fetchSections())
      );
    }
    return this.fetchSections();
  }

  private fetchSections(): Observable<any[]> {
    return this.http.get<{ _embedded: { sections: any[] } }>(this.apiUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
    }).pipe(
      map(response => response._embedded.sections),
      catchError(error => {
        if (error.status === 401) {
          alert('401 Unauthorized - Reauthenticating...');
          this.token = null;
          localStorage.removeItem('access_token');
          return this.authService.login({ username: 'user', password: '1qazXSW@' }).pipe(
            tap(response => this.token = response.access_token),
            switchMap(() => this.fetchSections()) // ✅ Retry after login
          );
        }
        throw error;
      })
    );
  }

  deleteSection(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  getSectionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}?projection=default`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.authService.makeLogin().pipe(
            tap(response => this.token = response.access_token),
            switchMap(() => this.getSectionById(id))
          );
        }
        throw error;
      })
    );
  }

  createSection(section: any) {
    let data = {
      name: section.name,
      description: section.description,
      length: section.length,
      speedLimit: section.speedLimit,
      speedLimitActual: section.speedLimitActual,
      startCamera: `https://eva-lpr.ge/api/cameras/${section.startCamera}`,
      endCamera: `https://eva-lpr.ge/api/cameras/${section.endCamera}`
    }

    return this.http.post(this.apiUrl, data, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  updateSection(section: any) {
    let data = {
      name: section.name,
      description: section.description,
      length: section.length,
      speedLimit: section.speedLimit,
      speedLimitActual: section.speedLimitActual,
      startCamera: `https://eva-lpr.ge/api/cameras/${section.startCamera}`,
      endCamera: `https://eva-lpr.ge/api/cameras/${section.endCamera}`
    }
    return this.http.put(`${this.apiUrl}/${section.id}`, data, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

}
