import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full space-y-6">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 bg-primary-700 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-xl">
            GP
          </div>
          <h1 class="text-2xl font-black text-gray-900">GrowPak Portal</h1>
          <p class="text-xs text-gray-500">Super Admin, Admin, Vendor, Store Manager & Field Agent Login</p>
        </div>

        @if (errorMessage()) {
          <div class="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="handleLogin()" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone or Email</label>
            <input
              type="text"
              [(ngModel)]="loginIdentifier"
              name="loginIdentifier"
              placeholder="+923260409887 or admin@growpak.store"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-600 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            [disabled]="isLoading()"
            class="w-full py-3 bg-primary-700 hover:bg-primary-800 disabled:bg-gray-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">
            {{ isLoading() ? 'Verifying...' : 'Sign In to Portal' }}
          </button>
        </form>

        <div class="bg-gray-50 rounded-2xl p-3 text-[11px] text-gray-500 space-y-1 border border-gray-200">
          <p class="font-bold text-gray-700">Seeded Credentials:</p>
          <p>Super Admin: <code>+923260409887</code> / <code>AdminGrowPak2026!</code></p>
          <p>Store Manager: <code>+923007654321</code> / <code>ManagerGrowPak2026!</code></p>
          <p>Field Agent: <code>+923009876543</code> / <code>AgentGrowPak2026!</code></p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  loginIdentifier = '+923260409887';
  password = 'AdminGrowPak2026!';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  handleLogin() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.post<any>('http://localhost:5000/api/v1/auth/login', {
      loginIdentifier: this.loginIdentifier,
      password: this.password,
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('growpak_token', res.data.tokens.accessToken);
          localStorage.setItem('growpak_user', JSON.stringify(res.data.user));
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Login failed');
      },
    });
  }
}
