import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should set serverError when passwords do not match', () => {
    component.form.setValue({ username: 'u1', password: 'abc123', confirmPassword: 'diff' });

    component.onSubmit();

    expect(component.serverError).toBe('รหัสผ่านไม่ตรงกัน');
    expect(component.isSubmitting).toBeFalse();
    expect(authSpy.register).not.toHaveBeenCalled();
  });

  it('should call register and navigate on success', () => {
    authSpy.register.and.returnValue(of({ userId: 1, username: 'u1' }));
    component.form.setValue({ username: 'u1', password: 'abc123', confirmPassword: 'abc123' });

    component.onSubmit();

    expect(component.isSubmitting).toBeFalse();
    expect(authSpy.register).toHaveBeenCalledWith('u1', 'abc123', 'abc123');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.serverError).toBeUndefined();
  });

  it('should set serverError on API error', () => {
    const serverErr = { error: 'Username already exists', status: 409 };
    authSpy.register.and.returnValue(throwError(() => serverErr));
    component.form.setValue({ username: 'u2', password: 'abc123', confirmPassword: 'abc123' });

    component.onSubmit();

    expect(component.isSubmitting).toBeFalse();
    expect(authSpy.register).toHaveBeenCalled();
    expect(component.serverError).toBe(serverErr.error);
  });
});
