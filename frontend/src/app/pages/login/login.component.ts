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
  errorMsg = '';
  isLoading = false;
  isRegisterMode = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMsg = '';
  }

  submit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMsg = 'Completa todos los campos';
      return;
    }
    this.isLoading = true;
    this.errorMsg = '';

    const action = this.isRegisterMode
      ? this.auth.register(this.username, this.password)
      : this.auth.login(this.username, this.password);

    action.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg =
          err?.error?.message || 'Error al conectar con el servidor';
      },
    });
  }
}
