import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col">
      <!-- Navbar -->
      <header class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center font-black text-sm">GP</div>
          <div>
            <span class="font-extrabold text-base tracking-tight block">GrowPak Operations</span>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Unified Multi-Role Console</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <span class="text-xs font-bold block">{{ currentUser()?.firstName }} {{ currentUser()?.lastName }}</span>
            <span class="text-[10px] px-2 py-0.5 bg-primary-800 text-primary-200 rounded font-semibold">{{ currentUser()?.roles?.join(', ') }}</span>
          </div>
          <button
            (click)="logout()"
            class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 hover:text-white transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <!-- Main Layout -->
      <div class="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <!-- Welcome Banner -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-xl font-black text-slate-900">
              Welcome back, {{ currentUser()?.firstName }}!
            </h1>
            <p class="text-xs text-slate-500 mt-1">
              Active Role: <span class="font-bold text-primary-700">{{ currentUser()?.roles?.[0] }}</span> | Scoped Vendor: <span class="font-semibold">{{ currentUser()?.vendorId ? 'Vendor #' + currentUser()?.vendorId : 'Global Platform Scope' }}</span>
            </p>
          </div>
          <div class="flex gap-2">
            <a href="http://localhost:4200" target="_blank" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all">
              View Live Storefront ↗
            </a>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div class="text-2xl font-black text-slate-900">1,000+</div>
            <span class="text-[11px] text-emerald-600 font-semibold">100% WooCommerce Parity</span>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Vendors</span>
            <div class="text-2xl font-black text-slate-900">100+</div>
            <span class="text-[11px] text-primary-700 font-semibold">Row-level Isolation</span>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipping Engine</span>
            <div class="text-2xl font-black text-slate-900">4 Slabs Active</div>
            <span class="text-[11px] text-blue-600 font-semibold">Field Agent: 0 PKR Shipping</span>
          </div>
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Background Queue</span>
            <div class="text-2xl font-black text-slate-900">Active (DB)</div>
            <span class="text-[11px] text-purple-600 font-semibold">In-process MySQL runner</span>
          </div>
        </div>

        <!-- Shipping Engine Slabs Table -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-base font-black text-slate-900">Weight-Based Shipping Rules Engine</h3>
            <span class="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold">Configured in DB</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600">
              <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th class="py-2.5 px-4">Tier / Name</th>
                  <th class="py-2.5 px-4">Weight Range</th>
                  <th class="py-2.5 px-4">Flat Rate (PKR)</th>
                  <th class="py-2.5 px-4">Per-Kg Rate (PKR)</th>
                  <th class="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (rule of shippingRules(); track rule.id) {
                  <tr>
                    <td class="py-3 px-4 font-bold text-slate-900">{{ rule.name }}</td>
                    <td class="py-3 px-4">{{ rule.minWeightKg }} kg - {{ rule.maxWeightKg ? rule.maxWeightKg + ' kg' : 'Above' }}</td>
                    <td class="py-3 px-4 font-bold text-primary-700">Rs. {{ rule.flatChargePkr }}</td>
                    <td class="py-3 px-4">{{ rule.perKgRatePkr > 0 ? 'Rs. ' + rule.perKgRatePkr + ' / kg' : '-' }}</td>
                    <td class="py-3 px-4"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">ACTIVE</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<any>(null);
  shippingRules = signal<any[]>([]);

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const userStr = localStorage.getItem('growpak_user');
      if (userStr) {
        this.currentUser.set(JSON.parse(userStr));
      } else {
        this.router.navigate(['/login']);
        return;
      }
    }

    this.http.get<any>('http://localhost:5000/api/v1/shipping/rules').subscribe({
      next: (res) => this.shippingRules.set(res.data || []),
      error: () => {},
    });
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('growpak_token');
      localStorage.removeItem('growpak_user');
    }
    this.router.navigate(['/login']);
  }
}
