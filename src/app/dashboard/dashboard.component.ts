import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Attempt to load profile from API. If unauthorized, send user to login.
    this.auth.profile().subscribe({
      next: (res) => {
        this.username = res?.username || "";
      },
      error: (err) => {
        const status = err?.status;
        if (status === 401) {
          this.router.navigate(['/']);
          return;
        }
        // fallback to stored username
        try { this.username = localStorage.getItem('username') || ''; } catch { this.username = ''; }
      }
    });
  }
}
