import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBase || '';
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const url = `${this.base}/Auth/login`;
    return this.http.post<any>(url, { username, password });
  }

  register(username: string, password: string, confirmPassword: string): Observable<any> {
    const url = `${this.base}/Auth/register`;
    return this.http.post<any>(url, { username, password, confirmPassword });
  }

  profile(): Observable<any> {
    const url = `${this.base}/Auth/profile`;
    const token = (() => {
      try { return localStorage.getItem('token') || ''; } catch { return ''; }
    })();
    const options = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return this.http.get<any>(url, options);
  }
}
