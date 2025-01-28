import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Camera {
  id: number;
  name: string;
  description: string;
  version: number;
  // add other camera properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  token: string | null = null;
  private apiUrl = 'https://eva-lpr.ge/api/cameras';

  constructor(private authService: AuthService, private http: HttpClient) { }

  getCameras(): Observable<Camera[]> {
    this.token = this.authService.getToken();

    if (!this.token) {
      alert('No token found, logging in...');
      return this.authService.makeLogin().pipe(
        tap(response => this.token = response.access_token),
        switchMap(() => this.fetchCameras())  
      );

    }
    return this.fetchCameras();
  }

  private fetchCameras(): Observable<Camera[]> {
    return this.http.get<{ _embedded: { cameras: Camera[] } }>(this.apiUrl, {
      headers: { Authorization: `Bearer ${this.token}` },
    }).pipe(
      map(response => {
        return response._embedded.cameras;
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          alert('401');
          this.authService.makeLogin().subscribe(() => this.getCameras());
        }
        throw error;
      })
    );
  }
}
