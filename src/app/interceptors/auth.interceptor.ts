import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    const clonedRequest = accessToken
      ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : req;

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.headers.has('Skip-Auth-Retry')) {
          return this.authService.refreshToken().pipe(
            switchMap((data: { accessToken: string, refreshToken: string }) => {
              localStorage.setItem('accessToken', data.accessToken);
              localStorage.setItem('refreshToken', data.refreshToken);
              const retryRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${data.accessToken}`,
                  'Skip-Auth-Retry': 'true' // Evita reintentos infinitos
                }
              });
              return next.handle(retryRequest);
            }),
            catchError(() => {
              this.router.navigate(['/login']);
              return throwError(() => new Error('Unauthorized'));
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
