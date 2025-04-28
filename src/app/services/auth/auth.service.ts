import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private refreshUrl = 'https://tuadmin-api-production.up.railway.app/api/auth/refresh';
  private loginUrl = 'https://tuadmin-api-production.up.railway.app/api/auth/login';

  constructor(private http: HttpClient) {}

  refreshToken(): Observable<{ accessToken: string, refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string, refreshToken: string }>(this.refreshUrl, { refreshToken }).pipe(
      switchMap(response => {
        return new Observable<{ accessToken: string, refreshToken: string }>(observer => {
          observer.next({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          });
          observer.complete();
        });
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<{accessToken: string, refreshToken: string}>(this.loginUrl, { email, password }).pipe(
      map(value => {
        localStorage.setItem('accessToken', value.accessToken);
        localStorage.setItem('refreshToken', value.refreshToken);
        return value;
      })
    )
  }
}
