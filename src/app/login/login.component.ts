import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  serverError?: string;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.serverError = undefined;
    const { username, password } = this.form.value;

    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res && res.token) {
          try { localStorage.setItem('token', res.token); } catch { }
        }
        try { localStorage.setItem('username', username); } catch {}
        // navigate to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.serverError = err?.error?.message || err.statusText || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      }
    });
  }
}
