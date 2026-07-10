import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  fullName = '';
  email = '';
  birthDate = '';
  errorMsg = '';
  isLoading = false;
  isRegisterMode = false;

  // Toast
  toast: { visible: boolean; type: 'success' | 'error' | 'loading'; message: string } = {
    visible: false,
    type: 'loading',
    message: '',
  };
  private toastTimer: any;

  constructor(private auth: AuthService, private router: Router) {}

  showToast(type: 'success' | 'error' | 'loading', message: string, duration = 0) {
    clearTimeout(this.toastTimer);
    this.toast = { visible: true, type, message };
    if (duration > 0) {
      this.toastTimer = setTimeout(() => {
        this.toast.visible = false;
      }, duration);
    }
  }

  hideToast() {
    clearTimeout(this.toastTimer);
    this.toast.visible = false;
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMsg = '';
    this.fullName = '';
    this.email = '';
    this.birthDate = '';
  }

  submit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.showToast('error', 'Por favor completa todos los campos', 3500);
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';
    this.showToast('loading', this.isRegisterMode ? 'Creando tu cuenta...' : 'Iniciando sesión...');

    const action = this.isRegisterMode
      ? this.auth.register(this.username, this.password, {
          fullName: this.fullName,
          email: this.email,
          birthDate: this.birthDate,
        })
      : this.auth.login(this.username, this.password);

    action.subscribe({
      next: () => {
        this.isLoading = false;
        this.showToast('success', this.isRegisterMode ? '¡Cuenta creada! Entrando al chat...' : '¡Bienvenido de vuelta!');
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'No se pudo conectar con el servidor';
        this.showToast('error', msg, 4000);
        this.errorMsg = msg;
      },
    });
  }
}

