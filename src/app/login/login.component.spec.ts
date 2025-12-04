import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should not call login when form invalid', () => {
    component.form.setValue({ username: '', password: '' });
    component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on success', () => {
    const mockResp = { token: 'abc123' };
    authSpy.login.and.returnValue(of(mockResp));

    spyOn(localStorage, 'setItem');

    component.form.setValue({ username: 'u1', password: 'p1' });
    component.onSubmit();

    expect(authSpy.login).toHaveBeenCalledWith('u1', 'p1');
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.serverError).toBeUndefined();
    expect(component.isSubmitting).toBeFalse();
  });

  it('should set serverError on API error', () => {
    const serverErr = { error: { message: 'Invalid credentials' }, status: 401 };
    authSpy.login.and.returnValue(throwError(() => serverErr));

    component.form.setValue({ username: 'u1', password: 'bad' });
    component.onSubmit();

    expect(authSpy.login).toHaveBeenCalled();
    expect(component.serverError).toBe('Invalid credentials');
    expect(component.isSubmitting).toBeFalse();
  });
});
