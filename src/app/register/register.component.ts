import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  serverError?: string;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: AbstractControl | null) {
    if (!group) return null;
    const pw = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    return pw === cpw ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.errors && this.form.errors['passwordMismatch']) {
        this.serverError = 'รหัสผ่านไม่ตรงกัน';
      }
      return;
    }

    this.isSubmitting = true;
    this.serverError = undefined;
    const { username, password, confirmPassword } = this.form.value;

    this.auth.register(username, password, confirmPassword).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        // on success navigate to login page
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting = false;
        // try to extract meaningful message from server
        this.serverError = err?.error || err?.error?.message || err.statusText || 'เกิดข้อผิดพลาดในการสมัคร';
      }
    });
  }
}
