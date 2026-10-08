import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private http = inject(HttpClient);
  
  public currentLang = signal<'en' | 'ur'>('en');
  public isMenuOpen = signal<boolean>(false);
  public siteSettings = signal<any>({
    siteName: 'GrowPak Store',
    phone: '+92-326-0409887',
    email: 'info@growtechsol.com',
    whatsappNumber: '+923260409887',
    address: 'Plot 60-D, Street 7, I-10/3, Islamabad, Pakistan',
  });

  public crops = signal<any[]>([]);

  constructor() {
    effect(() => {
      if (typeof document !== 'undefined') {
        const lang = this.currentLang();
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
      }
    });

    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<any>('http://localhost:5000/api/v1/cms/settings').subscribe({
      next: (res) => {
        if (res.data?.general) {
          this.siteSettings.set(res.data.general);
        }
      },
      error: () => {},
    });

    this.http.get<any>('http://localhost:5000/api/v1/cms/crops').subscribe({
      next: (res) => {
        if (res.data) {
          this.crops.set(res.data);
        }
      },
      error: () => {},
    });
  }

  public setLanguage(lang: 'en' | 'ur') {
    this.currentLang.set(lang);
  }

  public toggleMobileMenu() {
    this.isMenuOpen.update((v) => !v);
  }
}
